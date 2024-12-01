import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import { currentMatchedVideoAtom, videoAtom } from '@renderer/atoms/player'
import { db } from '@renderer/database/db'
import { tipcClient } from '@renderer/lib/client'
import { isWeb } from '@renderer/lib/utils'
import { Events } from '@suemor/xgplayer'
import { useAtomValue } from 'jotai'
import { throttle } from 'lodash-es'
import { useCallback, useEffect } from 'react'

import { useVideo } from '../loading/hooks'
import { usePlayerInstance } from '../setting/Context'

export const InitializeEvent = () => {
  const { hash } = useAtomValue(videoAtom)
  const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)
  const player = usePlayerInstance()
  const { importAnimeViaIPC } = useVideo()

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
      const latestAnime = await db.history.get(hash)
      await db.history.update(hash, {
        progress: latestAnime?.duration,
      })

      const urlList = player.config.nextEpisode.urlList as string[]
      const nextAnimalUrl = urlList?.indexOf(player.config.url as string)
      if (nextAnimalUrl === urlList.length - 1) {
        return
      }

      player.emit(Events.PLAYNEXT, urlList[nextAnimalUrl + 1] ?? urlList[0])
    })

    player.on(Events.PLAYNEXT, async (url: string) => {
      const path = await tipcClient?.getFilePathFromProtocolURL({ path: url })
      if (!path) {
        return
      }
      importAnimeViaIPC({ path })
    })
  }, [currentMatchedVideo.animeId, hash, player])

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

  useEffect(() => {
    initializePlayerEvent()
    return () => {
      grabFrame()
    }
  }, [initializePlayerEvent])
  return null
}
