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
import { db } from '@renderer/database/db'
import type { DB_History } from '@renderer/database/schemas/history'
import { tipcClient } from '@renderer/lib/client'
import { apiClient } from '@renderer/request'
import { RouteName } from '@renderer/router'
import { useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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

  const matchedVideo = useMemo(() => {
    if (currentMatchedVideo && currentMatchedVideo.episodeId) {
      return currentMatchedVideo
    }
    if (!matchData || !matchData.matches || !matchData.isMatched) {
      return null
    }
    const matchedVideo = matchData?.matches[0]
    return {
      episodeId: matchedVideo.episodeId,
      animeTitle: matchedVideo.animeTitle || '',
      animeId: matchedVideo.animeId,
      episodeTitle: matchedVideo.episodeTitle || '',
    }
  }, [matchData, currentMatchedVideo])

  useEffect(() => {
    if (matchData && matchedVideo) {
      setLoadingProgress(LoadingStatus.MATCH_ANIME)
      setCurrentMatchedVideo(matchedVideo)
    }
  }, [matchData])

  useEffect(() => {
    if (danmuData && matchedVideo) {
      saveToHistory({
        ...matchedVideo,
        danmaku: danmuData,
        path: url,
        progress: 0,
        duration: 0,
      })
      setLoadingProgress(LoadingStatus.READY_PLAY)
      const timeoutId = setTimeout(() => {
        setLoadingProgress(LoadingStatus.START_PLAY)
      }, 100)
      return () => clearTimeout(timeoutId)
    }
    return () => {}
  }, [danmuData])

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

const saveToHistory = async (params: Omit<DB_History, 'cover'>) => {
  const { animeId } = params
  const { bangumi } = await apiClient.bangumi.getBangumiDetailById(animeId)
  const historyData = {
    ...params,
    cover: bangumi.imageUrl,
  }
  const existingHistory = await db.history.where({ animeId: params.animeId }).first()
  if (existingHistory) {
    await db.history.update(existingHistory.animeId, historyData)
    return
  }
  await db.history.add(historyData)
}

export const useLoadingHistoricalAnime = () => {
  const setVideo = useSetAtom(videoAtom)
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const setProgress = useSetAtom(loadingDanmuProgressAtom)
  const effectOnce = useRef(false)
  const episodeId = location.state?.episodeId
  const loadingAnime = useCallback(async () => {
    const anime = await db.history.get({ episodeId })
    if (!anime || Array.isArray(anime)) {
      toast({
        title: '播放失败',
        description: '未找到历史记录',
        variant: 'destructive',
      })
      return
    }

    const animeData = await tipcClient?.getAnimeDetailByPath({ path: anime.path })
    if (!animeData?.ok) {
      toast({
        title: '播放失败',
        description: animeData?.message || '未找到历史记录',
        variant: 'destructive',
      })
      return
    }
    const { fileName, fileSize, fileHash } = animeData
    if (!fileHash || !fileName || !fileSize) {
      toast({
        title: '播放失败',
        description: '未找到历史记录',
        variant: 'destructive',
      })
      return
    }
    setVideo({
      hash: fileHash,
      name: fileName,
      size: fileSize,
      url: anime.path,
    })
    setProgress(LoadingStatus.CALC_HASH)
  }, [episodeId])

  useEffect(() => {
    if (!effectOnce.current) {
      effectOnce.current = true
      navigate(location.pathname, { replace: true })
      if (episodeId && location.pathname === RouteName.PLAYER) {
        loadingAnime()
      }
    }
  }, [loadingAnime])

  useEffect(() => {
    if (episodeId && location.pathname === RouteName.PLAYER) {
      setProgress(LoadingStatus.IMPORT_VIDEO)
    }
  }, [episodeId])
}
