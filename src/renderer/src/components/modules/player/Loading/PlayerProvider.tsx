import {
  currentMatchedVideoAtom,
  loadingDanmuProgressAtom,
  LoadingStatus,
} from '@renderer/atoms/player'
import { MatchAnimeDialog } from '@renderer/components/modules/player/Dialog/MatchAnimeDialog'
import { LoadingDanmuTimeLine } from '@renderer/components/modules/player/Timeline'
import { useAtom } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

import { useDanmuData, useMatchAnimeData } from './hooks'

export const VideoProvider: FC<PropsWithChildren> = ({ children }) => {
  const { clearPlayingVideo, matchData } = useMatchAnimeData()
  useDanmuData()
  const [currentMatchedVideo, setCurrentMatchedVideo] = useAtom(currentMatchedVideoAtom)
  const [loadingProgress, setLoadingProgress] = useAtom(loadingDanmuProgressAtom)

  if (loadingProgress !== null && loadingProgress < LoadingStatus.START_PLAY) {
    return (
      <>
        <LoadingDanmuTimeLine />
        <MatchAnimeDialog
          matchData={currentMatchedVideo.episodeId ? undefined : matchData}
          onSelected={(params) => {
            const id = params?.episodeId
            const title = params?.title
            if (!id || !title) {
              return setLoadingProgress(LoadingStatus.START_PLAY)
            }
            setCurrentMatchedVideo({
              episodeId: id,
              animeTitle: title,
            })
          }}
          onClosed={clearPlayingVideo}
        />
      </>
    )
  }
  return children
}
