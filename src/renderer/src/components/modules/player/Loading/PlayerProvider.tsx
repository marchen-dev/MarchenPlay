import {
  currentMatchedVideoAtom,
  loadingDanmuProgressAtom,
  LoadingStatus,
} from '@renderer/atoms/player'
import { MatchAnimeDialog } from '@renderer/components/modules/player/Dialog/MatchAnimeDialog'
import { LoadingDanmuTimeLine } from '@renderer/components/modules/player/Timeline'
import { useAtom } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

import { useDanmuData, useLoadingHistoricalAnime, useMatchAnimeData } from './hooks'

export const VideoProvider: FC<PropsWithChildren> = ({ children }) => {
  useLoadingHistoricalAnime()
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
            if (!params) {
              return setLoadingProgress(LoadingStatus.START_PLAY)
            }
            setCurrentMatchedVideo(params)
          }}
          onClosed={clearPlayingVideo}
        />
      </>
    )
  }
  return children
}
