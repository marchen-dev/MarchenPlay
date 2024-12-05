import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import { useClearPlayingVideo, videoAtom } from '@renderer/atoms/player'
import { db } from '@renderer/database/db'
import { tipcClient } from '@renderer/lib/client'
import { isWeb } from '@renderer/lib/utils'
import { Events } from '@suemor/xgplayer'
import { useAtomValue } from 'jotai'
import { throttle } from 'lodash-es'
import { useCallback, useEffect, useRef } from 'react'

import type { PlayerType } from '../hooks'
import { useVideo } from '../loading/hooks'
import { usePlayerInstance } from '../setting/Context'

export const InitializeEvent = () => {
  const player = usePlayerInstance()
  const { grabFrame, initializePlayerListener, initializePlayerEvent } = usePlayerInitialize(player)

  useEffect(() => {
    if (!player) {
      return
    }
    initializePlayerEvent()

    const listenerClear = initializePlayerListener()

    return () => {
      grabFrame()
      if (listenerClear) {
        listenerClear()
      }
    }
  }, [initializePlayerEvent])
  return null
}

const usePlayerInitialize = (player: PlayerType | null | undefined) => {
  const clickTimeout = useRef<number | null>(null)
  const { hash } = useAtomValue(videoAtom)
  const { importAnimeViaIPC } = useVideo()
  const resetVideo = useClearPlayingVideo()
  // 需要对 xgplayer 自带的全屏事件进行重写，以适配 electron 的全屏
  const initializePlayerListener = useCallback(() => {
    if (isWeb) {
      return
    }
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const isFull = await tipcClient?.getWindowIsFullScreen()
        if (!isFull) {
          player?.exitCssFullscreen()
        }
        tipcClient?.windowAction({ action: 'leave-full-screen' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    const videoElement = player?.media as HTMLVideoElement

    const handleDoubleClick = () => {
      if (clickTimeout.current !== null) {
        window.clearTimeout(clickTimeout.current)
        clickTimeout.current = null
      }
      tipcClient?.windowAction({ action: 'switch-full-screen' })
    }

    const handleSingleClick = () => {
      if (clickTimeout.current !== null) {
        window.clearTimeout(clickTimeout.current)
      }

      clickTimeout.current = window.setTimeout(() => {
        if (videoElement?.paused) {
          videoElement.play()
        } else {
          videoElement.pause()
        }
        clickTimeout.current = null
      }, 200) // 使用较短的延迟以区分单击和双击
    }
    if (videoElement) {
      videoElement.addEventListener('dblclick', handleDoubleClick)
      videoElement.addEventListener('click', handleSingleClick)
    }

    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (videoElement) {
        videoElement.removeEventListener('dblclick', handleDoubleClick)
        videoElement.removeEventListener('click', handleSingleClick)
      }
    }
  }, [player])

  const initializePlayerEvent = useCallback(async () => {
    if (!player) {
      return
    }
    player.getCssFullscreen()

    const anime = await db.history.get(hash)
    const enablePositioningProgress = !!anime?.progress
    if (enablePositioningProgress) {
      const playbackCompleted = anime?.progress === anime?.duration
      if (playbackCompleted) {
        player.currentTime = 0
      } else {
        player.currentTime = anime?.progress || 0
      }
    }

    // 保存视频进度
    player?.on(
      Events.TIME_UPDATE,
      throttle((data) => {
        if (!hash) {
          return
        }
        db.history.update(hash, {
          progress: data?.currentTime,
          duration: data?.duration,
        })
      }, 2000),
    )

    player.on(Events.LOADED_METADATA, (data) => {
      db.history.update(hash, {
        duration: data?.duration,
      })
    })

    player.on(Events.ENDED, async () => {
      if (!hash) {
        return
      }
      const latestAnime = await db.history.get(hash)
      await db.history.update(hash, {
        progress: latestAnime?.duration,
      })

      const urlList = player.config.nextEpisode.urlList as string[]
      const nextAnimeUrl = urlList?.indexOf(player.config.url as string)
      if (nextAnimeUrl === urlList.length - 1) {
        return
      }
      player.emit(Events.PLAYNEXT, urlList[nextAnimeUrl + 1] ?? urlList[0])
    })

    player.on(Events.PLAYNEXT, async (url: string) => {
      const path = await tipcClient?.getFilePathFromProtocolURL({ path: url })
      if (!path) {
        return
      }
      importAnimeViaIPC({ path })
    })

    // 点击左上角关闭按钮
    player.on('exit', async () => {
      player.destroy()
      tipcClient?.windowAction({ action: 'leave-full-screen' })
      resetVideo()
    })
  }, [hash, player])

  const grabFrame = useCallback(async () => {
    if (!isWeb) {
      const latestAnime = await db.history.get(hash)
      const animePath = latestAnime?.path.replace(MARCHEN_PROTOCOL_PREFIX, '')
      const isEnd = latestAnime?.progress === latestAnime?.duration
      if (!animePath) {
        return
      }
      const base64Image = await tipcClient?.grabFrame({
        path: animePath,
        time: isEnd
          ? ((latestAnime?.progress ?? 3) - 3).toString()
          : latestAnime?.progress.toString() || '0',
      })
      await db.history.update(hash, {
        thumbnail: base64Image,
      })
    }
  }, [hash])

  return {
    initializePlayerListener,
    initializePlayerEvent,
    grabFrame,
  }
}
