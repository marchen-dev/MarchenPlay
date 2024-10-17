import {
  currentMatchedVideoAtom,
  isLoadDanmakuAtom,
  loadingDanmuProgressAtom,
  LoadingStatus,
  useClearPlayingVideo,
  videoAtom,
} from '@renderer/atoms/player'
import { useToast } from '@renderer/components/ui/toast'
import { calculateFileHash } from '@renderer/lib/calc-file-hash'
import { tipcClient } from '@renderer/lib/client'
import { DanmuPosition, intToHexColor } from '@renderer/lib/danmu'
import queryClient from '@renderer/lib/query-client'
import { isWeb } from '@renderer/lib/utils'
import { apiClient } from '@renderer/request'
import type { CommentsModel } from '@renderer/request/models/comment'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import type { ChangeEvent, DragEvent } from 'react'
import { useEffect, useRef } from 'react'
import type { IPlayerOptions } from 'xgplayer'
import XgPlayer, { Danmu } from 'xgplayer'

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

    const url = URL.createObjectURL(file)
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

export const useXgPlayer = (url: string) => {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const { toast } = useToast()
  const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)
  const isLoadDanmaku = useAtomValue(isLoadDanmakuAtom)
  const danmuData = queryClient.getQueryData([apiClient.comment.Commentkeys, url]) as
    | CommentsModel
    | undefined

  useEffect(() => {
    let player: XgPlayer | null = null

    if (playerRef.current) {
      const xgplayerConfig = {
        ...playerBaseConfig,
        el: playerRef.current,
        url,
      } as IPlayerOptions

      if (isLoadDanmaku) {
        xgplayerConfig.plugins = [...(xgplayerConfig.plugins || []), Danmu]
        xgplayerConfig.danmu = {
          comments: danmuData?.comments?.map((comment) => {
            const [start, postition, color] = comment.p.split(',').map(Number)
            const startInMs = start * 1000

            const mode = DanmuPosition[postition]
            const danmakuColor = intToHexColor(color)
            const isWhiteDanmaku = danmakuColor === '#ffffff'
            return {
              duration: 15000, // 弹幕持续显示时间,毫秒(最低为5000毫秒)
              id: comment.cid, // 弹幕id，需唯一
              start: startInMs, // 弹幕出现时间，毫秒BB
              txt: comment.m, // 弹幕文字内容
              mode,
              style: {
                color: danmakuColor,
                ...(isWhiteDanmaku && {
                  textShadow: `
                -1px -1px 0 #000,  
                 1px -1px 0 #000,
                -1px  1px 0 #000,
                 1px  1px 0 #000
              `,
                }),
              },
            }
          }),
          ...danmakuConfig,
        }
        toast({
          title: currentMatchedVideo.animeTitle,
          description: `共加载 ${danmuData?.count} 条弹幕`,
          duration: 2000,
        })
      }

      player = new XgPlayer(xgplayerConfig)
      player.getCssFullscreen()
    }
    return () => player?.destroy()
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
