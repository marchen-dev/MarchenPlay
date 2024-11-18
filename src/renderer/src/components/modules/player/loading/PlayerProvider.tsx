import {
  currentMatchedVideoAtom,
  loadingDanmuProgressAtom,
  LoadingStatus,
  videoAtom,
} from '@renderer/atoms/player'
import { MatchAnimeDialog } from '@renderer/components/modules/player/loading/dialog/MatchAnimeDialog'
import { LoadingDanmuTimeLine } from '@renderer/components/modules/player/Timeline'
import { useAtom, useAtomValue } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

import { saveToHistory, useDanmuData, useLoadingHistoricalAnime, useMatchAnimeData } from './hooks'

export const VideoProvider: FC<PropsWithChildren> = ({ children }) => {
  useLoadingHistoricalAnime()
  const { clearPlayingVideo, matchData } = useMatchAnimeData()
  const { url, hash, name } = useAtomValue(videoAtom)
  const { startPlaying } = useDanmuData()
  const [currentMatchedVideo, setCurrentMatchedVideo] = useAtom(currentMatchedVideoAtom)
  const [loadingProgress, setLoadingProgress] = useAtom(loadingDanmuProgressAtom)

  if ((loadingProgress !== null && loadingProgress < LoadingStatus.START_PLAY) || !startPlaying) {
    return (
      <>
        <LoadingDanmuTimeLine />
        <MatchAnimeDialog
          matchData={currentMatchedVideo.episodeId ? undefined : matchData}
          onSelected={(params) => {
            if (!params) {
              saveToHistory({
                hash,
                path: url,
                progress: 0,
                duration: 0,
                animeTitle: name,
              })
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
