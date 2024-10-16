import {
  currentMatchedVideoAtom,
  isLoadDanmakuAtom,
  loadingDanmuProgressAtom,
  LoadingStatus,
  useClearPlayingVideo,
} from '@renderer/atoms/player'
import { MatchAnimeDialog } from '@renderer/components/modules/player/Dialog/MatchAnimeDialog'
import { LoadingDanmuTimeLine } from '@renderer/components/modules/player/Timeline'
import { apiClient } from '@renderer/request'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import type { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useMatchAnimeData } from './hook'

export const VideoProvider: FC<PropsWithChildren> = ({ children }) => {
  const { matchData, url } = useMatchAnimeData()
  const location = useLocation()
  const [currentMatchedVideo, setCurrentMatchedVideo] = useAtom(currentMatchedVideoAtom)
  const isLoadDanmaku = useAtomValue(isLoadDanmakuAtom)
  const [loadingProgress, setLoadingProgress] = useAtom(loadingDanmuProgressAtom)
  const clearPlayingVideo = useClearPlayingVideo()
  const resetCurrentMatchedVideo = useResetAtom(currentMatchedVideoAtom)

  const { data: danmuData } = useQuery({
    queryKey: [apiClient.comment.Commentkeys, url],
    queryFn: () => {
      if (!matchData?.matches) {
        return null
      }
      if (!currentMatchedVideo) {
        return null
      }
      return apiClient.comment.getDanmu(+currentMatchedVideo.episodeId)
    },
    enabled: isLoadDanmaku,
  })
  useEffect(() => {
    if (matchData) {
      setLoadingProgress(LoadingStatus.MARCH_ANIME)
      if (matchData.isMatched && matchData.matches) {
        const matchedVideo = matchData.matches[0]
        setCurrentMatchedVideo({
          episodeId: matchedVideo.episodeId,
          animeTitle: `${matchedVideo.animeTitle} - ${matchedVideo.episodeTitle}`,
        })
      }
    }
  }, [matchData, setLoadingProgress])

  useEffect(() => {
    if (danmuData) {
      setLoadingProgress(LoadingStatus.READY_PLAY)
      const timeoutId = setTimeout(() => {
        setLoadingProgress(LoadingStatus.START_PLAY)
      }, 100)
      return () => clearTimeout(timeoutId)
    }

    return () => {}
  }, [danmuData, setLoadingProgress])

  useEffect(() => {
    resetCurrentMatchedVideo()
  }, [url])

  useEffect(
    () => () => {
      clearPlayingVideo()
    },
    [location.pathname],
  )
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
