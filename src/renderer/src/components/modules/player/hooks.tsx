import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import { currentMatchedVideoAtom, isLoadDanmakuAtom, videoAtom } from '@renderer/atoms/player'
import { usePlayerSettingsValue } from '@renderer/atoms/settings/player'
import { useToast } from '@renderer/components/ui/toast'
import setting from '@renderer/components/ui/xgplayer/plugins/setting/setting'
import { db } from '@renderer/database/db'
import { tipcClient } from '@renderer/lib/client'
import { DanmuPosition, intToHexColor } from '@renderer/lib/danmu'
import queryClient from '@renderer/lib/query-client'
import { isWeb } from '@renderer/lib/utils'
import { apiClient } from '@renderer/request'
import type { CommentsModel } from '@renderer/request/models/comment'
import type { IPlayerOptions } from '@suemor/xgplayer'
import XgPlayer, { Danmu, Events } from '@suemor/xgplayer'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

export interface PlayerType extends XgPlayer {
  danmu?: Danmu
}

export const useXgPlayer = (url: string) => {
  const playerRef = useRef<HTMLDivElement | null>(null)
  const { toast, dismiss } = useToast()
  const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)
  const { player, hash } = useAtomValue(videoAtom)
  const setPlayer = useSetAtom(videoAtom)
  const isLoadDanmaku = useAtomValue(isLoadDanmakuAtom)
  const playerSettings = usePlayerSettingsValue()
  const { danmakuDuration, danmakuFontSize, danmakuEndArea } = playerSettings

  const danmuData = queryClient.getQueryData([
    apiClient.comment.Commentkeys.getDanmu,
    url,
    playerSettings.enableTraditionalToSimplified,
  ]) as CommentsModel | undefined

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
      const _player = new XgPlayer(xgplayerConfig)
      setPlayer((prev) => ({ ...prev, player: _player }))

      if (!isWeb) {
        _player.on(Events.DESTROY, async () => {
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
        })
      }

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
