import {
  loadingDanmuProgressAtom,
  LoadingStatus,
  useClearPlayingVideo,
  videoAtom,
} from '@renderer/atoms/player'
import { useToast } from '@renderer/components/ui/toast'
import { calculateFileHash } from '@renderer/libs/calc-file-hash'
import { tipcClient } from '@renderer/libs/client'
import { isWeb } from '@renderer/libs/utils'
import { useAtom, useSetAtom } from 'jotai'
import type { ChangeEvent, DragEvent } from 'react'

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

export const playerBaseConfig = {
  theme: '#ffad00',
  volume: 1,
  autoplay: true,
  flip: true,
  playbackRate: true,
  aspectRatio: true,
  setting: true,
  screenshot: true,
  pip: true,
  fullscreen: true,
  fullscreenWeb: true,
  subtitleOffset: true,
  miniProgressBar: true,
  lang: 'zh-cn',
  lock: true,
  fastForward: true,
  airplay: true,
} satisfies Omit<Artplayer['Option'], 'container' | 'url'>
