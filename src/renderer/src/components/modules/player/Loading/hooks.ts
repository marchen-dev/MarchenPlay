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
import { apiClient } from '@renderer/request'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useMatchAnimeData = () => {
  const { hash, size, name, url } = useAtomValue(videoAtom)
  const clearPlayingVideo = useClearPlayingVideo()
  const { toast } = useToast()
  const location = useLocation()
  const resetCurrentMatchedVideo = useResetAtom(currentMatchedVideoAtom)
  const { data: matchData, isError } = useQuery({
    queryKey: [apiClient.match.Matchkeys, url],
    queryFn: () =>
      apiClient.match.postVideoEpisodeId({ fileSize: size, fileHash: hash, fileName: name }),
    enabled: !!hash,
  })

  useEffect(() => {
    resetCurrentMatchedVideo()
  }, [url])

  useEffect(
    () => () => {
      if (isError) {
        toast({
          title: '播放失败',
          description: '请检查网络连接或稍后再试',
          variant: 'destructive',
        })
      }
      clearPlayingVideo()
    },
    [location.pathname, isError],
  )
  return { matchData, url, clearPlayingVideo }
}

export const useDanmuData = () => {
  const isLoadDanmaku = useAtomValue(isLoadDanmakuAtom)
  const { enableTraditionalToSimplified } = usePlayerSettingsValue()
  const { matchData, url } = useMatchAnimeData()
  const [currentMatchedVideo, setCurrentMatchedVideo] = useAtom(currentMatchedVideoAtom)
  const { toast } = useToast()
  const clearPlayingVideo = useClearPlayingVideo()
  const setLoadingProgress = useSetAtom(loadingDanmuProgressAtom)
  const { data: danmuData, isError } = useQuery({
    queryKey: [apiClient.comment.Commentkeys, url],
    queryFn: () => {
      if (!matchData?.matches) {
        return null
      }
      if (!currentMatchedVideo) {
        return null
      }
      return apiClient.comment.getDanmu(+currentMatchedVideo.episodeId, {
        chConvert: enableTraditionalToSimplified ? 1 : 0,
      })
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
    if (isError) {
      toast({
        title: '播放失败',
        description: '请检查网络连接或稍后再试',
        variant: 'destructive',
      })
      clearPlayingVideo()
    }
  }, [isError])

  return {
    danmuData,
  }
}
