import { ArtPlayer } from '@renderer/components/ui/artplayer/ArtPlayer'
import { DanmuPosition, intToHexColor } from '@renderer/libs/danmu'
import { apiClient } from '@renderer/request'
import type { CommentsModel } from '@renderer/request/models/comment'
import { useQuery } from '@tanstack/react-query'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import type { FC } from 'react'

import { playerBaseConfig } from './hooks'

interface PlayerProps {
  url: string
}

export const Player: FC<PlayerProps> = (props) => {
  const { url } = props
  // const playerRef = useRef<HTMLDivElement | null>(null)
  // const { toast } = useToast()
  const { data: danmuData } = useQuery<CommentsModel>({
    queryKey: [apiClient.comment.Commentkeys, url],
  })

  // const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)

  // useEffect(() => {
  //   if (playerRef.current) {
  //     new Artplayer({
  //       container: playerRef.current,
  //       url,
  //     })
  //   }
  // }, [])
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
            margin: [10, '25%'],
          }),
        ],
      }}
      style={{
        width: '100%',
        height: '100%',
      }}
      getInstance={(art) => console.info(art)}
    />
  )
}
