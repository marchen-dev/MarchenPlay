import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
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
import subtitle from '@renderer/components/ui/xgplayer/plugins/subtitle'
import { db } from '@renderer/database/db'
import { usePlayAnimeFailedToast } from '@renderer/hooks/use-toast'
import { calculateFileHash } from '@renderer/lib/calc-file-hash'
import { tipcClient } from '@renderer/lib/client'
import { DanmuPosition, intToHexColor } from '@renderer/lib/danmu'
import { isDev } from '@renderer/lib/env'
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
  const { showFailedToast } = usePlayAnimeFailedToast()
  const clearPlayingVideo = useClearPlayingVideo()
  const importAnimeViaBrowser = async (
    e: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>,
  ) => {
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
      return showFailedToast({ title: '格式错误', description: '请导入 mp4 或者 mkv 格式的动漫' })
    }

    let url = ''
    if (isWeb) {
      url = URL.createObjectURL(file)
    } else {
      const path = window.api.showFilePath(file)
      url = `${MARCHEN_PROTOCOL_PREFIX}${path}`
    }
    const { size, name } = file
    const fileName = name.slice(0, Math.max(0, name.lastIndexOf('.'))) || name
    try {
      const hash = await calculateFileHash(file)
      setVideo({ url, hash, size, name: fileName })
      setProgress(LoadingStatus.CALC_HASH)
    } catch (error) {
      console.error('Failed to calculate file hash:', error)
      showFailedToast({ title: '播放失败', description: '计算视频 hash 值出现异常，请重试' })
    }
  }

  const importAnimeViaIPC = useCallback(async () => {
    const path = await tipcClient?.importAnime()
    clearPlayingVideo()
    if (!path) {
      return
    }
    const url = `${MARCHEN_PROTOCOL_PREFIX}${path}`
    const animeData = await tipcClient?.getAnimeDetailByPath({ path: url })
    if (!animeData?.ok) {
      showFailedToast({ title: '播放失败', description: animeData?.message || '' })
      return
    }
    const { fileHash, fileName, fileSize } = animeData
    if (!fileHash || !fileHash || !fileSize) {
      showFailedToast({ title: '播放失败', description: '无法读取视频' })
      return
    }
    setVideo({ url, hash: fileHash, size: fileSize, name: fileName })
    setProgress(LoadingStatus.CALC_HASH)
  }, [])

  return {
    importAnimeViaBrowser,
    importAnimeViaIPC,
    url: video.url,
    showAddVideoTips: !video.url,
  }
}
export let player: (XgPlayer & { danmu?: Danmu }) | null = null

export const useXgPlayer = (url: string) => {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const { toast, dismiss } = useToast()
  const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)
  const isLoadDanmaku = useAtomValue(isLoadDanmakuAtom)
  const playerSettings = usePlayerSettingsValue()
  const { danmakuDuration, danmakuFontSize, danmakuEndArea } = playerSettings

  const danmuData = queryClient.getQueryData([
    apiClient.comment.Commentkeys.getDanmu,
    url,
    playerSettings.enableTraditionalToSimplified,
  ]) as CommentsModel | undefined

  const initializePlayerEvent = useCallback(async () => {
    if (!player) {
      return
    }
    !isDev && player.getCssFullscreen()

    if (isLoadDanmaku) {
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

      if (!isWeb) {
        player.on(Events.DESTROY, async () => {
          const latestAnime = await db.history.get(currentMatchedVideo.animeId)
          const animePath = latestAnime?.path.replace(MARCHEN_PROTOCOL_PREFIX, '')
          if (!animePath) {
            return
          }
          const base64Image = await tipcClient?.grabFrame({
            path: animePath,
            time: latestAnime?.progress.toString() || '0',
          })
          await db.history.update(currentMatchedVideo.animeId, {
            thumbnail: base64Image,
          })
        })
      }
    }
    // player.on(Events.LOADED_DATA, () => {
    //   const instance = new SubtitlesOctopus({
    //     availableFonts: {
    //       'times new roman': TimesNewRomanFont,
    //     },
    //     fallbackFont,
    //     video: player?.media,
    //     subUrl: Test,
    //     workerUrl,
    //     legacyWorkerUrl,
    //     // legacyWorkerUrl:'/subtitles-octopus-worker-legacy.js'
    //   })
    // })
  }, [currentMatchedVideo.animeId, isLoadDanmaku])

  useEffect(() => {
    if (player?.isPlaying && isLoadDanmaku) {
      player.danmu?.setFontSize(+danmakuFontSize, 24)
      player.danmu?.setAllDuration('all', +danmakuDuration)
      player.danmu?.setArea({
        start: 0,
        end: +danmakuEndArea,
      })
    }

    return () => {
      dismiss()
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
                fontWeight: 600,
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
          area: {
            start: 0,
            end: +danmakuEndArea,
          },
        }
      }

      player = new XgPlayer(xgplayerConfig)
      initializePlayerEvent()
    }
    return () => {
      player?.destroy()
    }
  }, [playerRef, danmuData, url])

  return { playerRef, player }
}

const playerBaseConfig = {
  height: '100%',
  width: '100%',
  lang: 'zh',
  autoplay: true,
  miniprogress: true,
  fullscreen: {
    index: 0,
  },
  cssFullscreen: {
    index: 1,
  },
  setting: {
    index: 2,
  },
  volume: {
    index: 3,
    default: 1,
  },
  rotate: {
    index: 4,
  },
  playbackRate: {
    index: 5,
  },
  plugins: [subtitle],
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
