import { MARCHEN_PROTOCOL } from '@main/constants/protocol'
import {
  currentMatchedVideoAtom,
  isLoadDanmakuAtom,
  loadingDanmuProgressAtom,
  LoadingStatus,
  useClearPlayingVideo,
  videoAtom,
} from '@renderer/atoms/player'
import { usePlayerSettingsValue } from '@renderer/atoms/settings/player'
import { useToast } from '@renderer/components/ui/toast'
import { db } from '@renderer/database/db'
import { calculateFileHash } from '@renderer/lib/calc-file-hash'
import { tipcClient } from '@renderer/lib/client'
import { DanmuPosition, intToHexColor } from '@renderer/lib/danmu'
import queryClient from '@renderer/lib/query-client'
import { isWeb } from '@renderer/lib/utils'
import { apiClient } from '@renderer/request'
import type { CommentsModel } from '@renderer/request/models/comment'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { throttle } from 'lodash-es'
import type { ChangeEvent, DragEvent } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import type { IPlayerOptions } from 'xgplayer'
import XgPlayer, { Danmu, Events } from 'xgplayer'

export const useVideo = () => {
  const [video, setVideo] = useAtom(videoAtom)
  const setProgress = useSetAtom(loadingDanmuProgressAtom)
  const { toast } = useToast()
  const clearPlayingVideo = useClearPlayingVideo()
  const handleNewVideo = async (e: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setProgress(LoadingStatus.IMPORT_VIDEO)
    let file: File | undefined
    if (e.type === 'drop') {
      const dragEvent = e as DragEvent<HTMLDivElement>
      file = dragEvent.dataTransfer?.files[0]
    } else if (e.type === 'change') {
      const changeEvent = e as ChangeEvent<HTMLInputElement>
      file = changeEvent.target?.files?.[0]
    }

    if (!file || !file?.type.startsWith('video/')) {
      clearPlayingVideo()
      if (isWeb) {
        return toast({
          title: '格式错误',
          description: '请导入视频文件',
          variant: 'destructive',
        })
      }
      return tipcClient?.showErrorDialog({ title: '格式错误', content: '请导入视频文件' })
    }

    let url = ''
    if (isWeb) {
      url = URL.createObjectURL(file)
    } else {
      const path = window.api.showFilePath(file)
      url = `${MARCHEN_PROTOCOL}://${path}`
    }
    const { size, name } = file
    const fileName = name.slice(0, Math.max(0, name.lastIndexOf('.'))) || name
    try {
      const hash = await calculateFileHash(file)
      setVideo({ url, hash, size, name: fileName })
      setProgress(LoadingStatus.CALC_HASH)
    } catch (error) {
      console.error('Failed to calculate file hash:', error)
      clearPlayingVideo()
      if (isWeb) {
        toast({
          title: '播放失败',
          description: '计算视频 hash 值出现异常，请重试',
          variant: 'destructive',
        })
      }
      return tipcClient?.showErrorDialog({
        title: '播放失败',
        content: '计算视频 hash 值出现异常，请重试',
      })
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return {
    handleNewVideo,
    handleDragOver,
    url: video.url,
    showAddVideoTips: !video.url,
  }
}
let player: (XgPlayer & { danmu?: Danmu }) | null = null

export const useXgPlayer = (url: string) => {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const { toast } = useToast()
  const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)
  const isLoadDanmaku = useAtomValue(isLoadDanmakuAtom)
  const playerSettings = usePlayerSettingsValue()
  const { danmakuDuration, danmakuFontSize } = playerSettings

  const danmuData = queryClient.getQueryData([
    apiClient.comment.Commentkeys.getDanmu,
    url,
    playerSettings.enableTraditionalToSimplified,
  ]) as CommentsModel | undefined
  const initializePlayerEvent = useCallback(async () => {
    if (!player) {
      return
    }

    if (isLoadDanmaku) {
      player?.on(
        Events.TIME_UPDATE,
        throttle((data) => {
          db.history.update(currentMatchedVideo.animeId, {
            progress: data?.currentTime,
            duration: data?.duration,
          })
        }, 2000),
      )
      player.on(Events.LOADED_METADATA, (data) => {
        db.history.update(currentMatchedVideo.animeId, {
          duration: data?.duration,
        })
      })

      const anime = await db.history.get(currentMatchedVideo.animeId)
      const enablePositioningProgress =
        !!anime?.progress && anime.episodeId === currentMatchedVideo.episodeId
      if (enablePositioningProgress) {
        player.currentTime = anime?.progress || 0
      }

      toast({
        title: `${currentMatchedVideo.animeTitle} - ${currentMatchedVideo.episodeTitle}`,
        description: (
          <div>
            <p>共加载 {danmuData?.count} 条弹幕</p>
            {enablePositioningProgress && <p>已为您定位到上次观看进度</p>}
          </div>
        ),
        duration: 5000,
      })
    }
  }, [currentMatchedVideo.animeId, isLoadDanmaku])

  useEffect(() => {
    if (player?.isPlaying && isLoadDanmaku) {
      player.danmu?.setFontSize(+danmakuFontSize, 24)
      player.danmu?.setAllDuration('all', +danmakuDuration)
    }
  }, [playerSettings])

  useEffect(() => {
    if (playerRef.current) {
      const xgplayerConfig = {
        ...playerBaseConfig,
        el: playerRef.current,
        url,
      } as IPlayerOptions

      if (isLoadDanmaku) {
        xgplayerConfig.plugins = [...(xgplayerConfig.plugins || []), Danmu]
        xgplayerConfig.danmu = {
          ...danmakuConfig,
          comments: danmuData?.comments?.map((comment) => {
            const [start, postition, color] = comment.p.split(',').map(Number)
            const startInMs = start * 1000

            const mode = DanmuPosition[postition]
            const danmakuColor = intToHexColor(color)
            return {
              duration: +danmakuDuration, // 弹幕持续显示时间,毫秒(最低为5000毫秒)
              id: comment.cid, // 弹幕id，需唯一
              start: startInMs, // 弹幕出现时间，毫秒BB
              txt: comment.m, // 弹幕文字内容
              mode,
              style: {
                color: danmakuColor,
                fontWeight: 700,
                textShadow: `
                rgb(0, 0, 0) 1px 0px 1px, 
                rgb(0, 0, 0) 0px 1px 1px, 
                rgb(0, 0, 0) 0px -1px 1px, 
                rgb(0, 0, 0) -1px 0px 1px
              `,
              },
            }
          }),
          fontSize: +danmakuFontSize,
        }
      }

      player = new XgPlayer(xgplayerConfig)
      initializePlayerEvent()
    }
    return () => {
      player?.destroy()
    }
  }, [playerRef, danmuData, url])

  return { playerRef }
}

const playerBaseConfig = {
  height: '100%',
  width: '100%',
  lang: 'zh',
  autoplay: true,
  volume: 1,
  miniprogress: true,
  screenShot: true,
  pip: true,
  rotate: true,
  download: true,
} satisfies IPlayerOptions

const danmakuConfig = {
  fontSize: 25,
  area: {
    start: 0,
    end: 0.25,
  },
  ext: {
    mouseControl: true,
    mouseControlPause: true,
  },
}
