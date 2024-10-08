import { currentMatchedVideoAtom } from '@renderer/atoms/player'
import { ArtPlayer } from '@renderer/components/ui/artplayer/ArtPlayer'
import { useToast } from '@renderer/components/ui/toast'
import { DanmuPosition, intToHexColor } from '@renderer/libs/danmu'
import { apiClient } from '@renderer/request'
import type { CommentsModel } from '@renderer/request/models/comment'
import { useQuery } from '@tanstack/react-query'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { useCallback } from 'react'

import { playerBaseConfig } from './hooks'

interface PlayerProps {
  url: string
}

export const Player: FC<PlayerProps> = (props) => {
  const { url } = props
  // const playerRef = useRef<HTMLDivElement | null>(null)
  const { toast } = useToast()
  const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)

  const { data: danmuData } = useQuery<CommentsModel>({
    queryKey: [apiClient.comment.Commentkeys, url],
  })

  const handleEvent = useCallback(
    (artplayer: Artplayer) => {
      artplayer.on('ready', () => {
        toast({
          title: currentMatchedVideo.animeTitle,
          description: `共加载 ${danmuData?.count} 条弹幕`,
          duration: 2000,
        })
      })
    },
    [currentMatchedVideo.animeTitle, danmuData?.count, toast],
  )

  if (!danmuData) {
    return
  }

  return (
    <ArtPlayer
      option={{
        ...playerBaseConfig,
        url,
        plugins: [
          artplayerPluginDanmuku({
            danmuku: danmuData.comments.map((comment) => {
              const [start, postition, color] = comment.p.split(',').map(Number)
              const startInMs = start
              const mode = DanmuPosition[postition]
              return {
                text: comment.m,
                time: startInMs,
                mode,
                color: intToHexColor(color),
              }
            }),
            heatmap: true, // 是否开启热力图
            speed: 10,
            margin: [10, '75%'],
            antiOverlap: true,
          }),
        ],
      }}
      className="size-full"
      getInstance={handleEvent}
    />
  )
}
