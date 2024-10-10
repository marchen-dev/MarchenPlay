import { currentMatchedVideoAtom } from '@renderer/atoms/player'
import { useToast } from '@renderer/components/ui/toast'
import { DanmuPosition, intToHexColor } from '@renderer/libs/danmu'
import { apiClient } from '@renderer/request'
import type { CommentsModel } from '@renderer/request/models/comment'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import XgPlayer from 'xgplayer'

import { playerBaseConfig } from './hooks'

interface PlayerProps {
  url: string
}

export const Player: FC<PlayerProps> = (props) => {
  const { url } = props
  const playerRef = useRef<HTMLDivElement | null>(null)
  const { toast } = useToast()
  const { data: danmuData } = useQuery<CommentsModel>({
    queryKey: [apiClient.comment.Commentkeys, url],
  })

  const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)

  useEffect(() => {
    let player: XgPlayer | null = null
    if (playerRef.current && danmuData) {
      player = new XgPlayer({
        ...playerBaseConfig,
        el: playerRef.current,
        url,

        danmu: {
          comments: danmuData.comments.map((comment) => {
            const [start, postition, color] = comment.p.split(',').map(Number)
            const startInMs = start * 1000

            const mode = DanmuPosition[postition]
            return {
              duration: 15000, // 弹幕持续显示时间,毫秒(最低为5000毫秒)
              id: comment.cid, // 弹幕id，需唯一
              start: startInMs, // 弹幕出现时间，毫秒BB
              txt: comment.m, // 弹幕文字内容
              mode,
              style: {
                color: intToHexColor(color),
              },
            }
          }),
          ...playerBaseConfig.danmu,
        },
      })
      toast({
        title: currentMatchedVideo.animeTitle,
        description: `共加载 ${danmuData.count} 条弹幕`,
        duration: 2000,
      })

      player.getCssFullscreen()
    }
    return () => player?.destroy()
  }, [playerRef, danmuData, url])

  return <div ref={playerRef} />
}
