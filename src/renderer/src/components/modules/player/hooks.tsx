import { currentMatchedVideoAtom, isLoadDanmakuAtom } from '@renderer/atoms/player'
import { usePlayerSettingsValue } from '@renderer/atoms/settings/player'
import { useToast } from '@renderer/components/ui/toast'
import setting from '@renderer/components/ui/xgplayer/plugins/setting/setting'
import { DanmuPosition, intToHexColor } from '@renderer/lib/danmu'
import queryClient from '@renderer/lib/query-client'
import { apiClient } from '@renderer/request'
import type { CommentsModel } from '@renderer/request/models/comment'
import type { IPlayerOptions } from '@suemor/xgplayer'
import XgPlayer, { Danmu } from '@suemor/xgplayer'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'

export interface PlayerType extends XgPlayer {
  danmu?: Danmu
}

let _playerInstance: PlayerType | null = null

export const useXgPlayer = (url: string) => {
  const [playerInstance, setPlayerInstance] = useState<PlayerType | null>(null)
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

  useEffect(() => {
    if (playerInstance?.isPlaying && isLoadDanmaku) {
      playerInstance.danmu?.setFontSize(+danmakuFontSize, 24)
      playerInstance.danmu?.setAllDuration('all', +danmakuDuration)
      playerInstance.danmu?.setArea({
        start: 0,
        end: +danmakuEndArea,
      })
    }

    return () => {
      dismiss()
    }
  }, [playerSettings])

  useEffect(() => {
    if (playerRef.current && !playerInstance) {
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
      _playerInstance = new XgPlayer(xgplayerConfig)
      setPlayerInstance(_playerInstance)
      if (isLoadDanmaku) {
        toast({
          title: `${currentMatchedVideo.animeTitle} - ${currentMatchedVideo.episodeTitle}`,
          description: (
            <div>
              <p>共加载 {danmuData?.count} 条弹幕</p>
            </div>
          ),
          duration: 5000,
        })
      }
    }
    return () => {
      _playerInstance?.destroy()
      playerInstance?.destroy()
    }
  }, [playerRef])

  return { playerRef, playerInstance }
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
  [setting.pluginName]: {
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
  plugins: [setting],
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
