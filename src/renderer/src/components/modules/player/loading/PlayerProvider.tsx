import {
  currentMatchedVideoAtom,
  loadingDanmuProgressAtom,
  LoadingStatus,
  videoAtom,
} from '@renderer/atoms/player'
import { MatchAnimeDialog } from '@renderer/components/modules/player/loading/dialog/MatchAnimeDialog'
import { LoadingDanmuTimeLine } from '@renderer/components/modules/player/Timeline'
import queryClient from '@renderer/lib/query-client'
import { apiClient } from '@renderer/request'
import { useAtom, useAtomValue } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

import { saveToHistory, useDanmuData, useLoadingHistoricalAnime, useMatchAnimeData } from './hooks'

export const VideoProvider: FC<PropsWithChildren> = ({ children }) => {
  useLoadingHistoricalAnime()
  const { clearPlayingVideo, matchData } = useMatchAnimeData()
  const { url, hash, name } = useAtomValue(videoAtom)
  useDanmuData()
  const [currentMatchedVideo, setCurrentMatchedVideo] = useAtom(currentMatchedVideoAtom)
  const [loadingProgress, setLoadingProgress] = useAtom(loadingDanmuProgressAtom)
  if (loadingProgress !== null && loadingProgress < LoadingStatus.START_PLAY) {
    return (
      <>
        {/* 加载进度条 */}
        <LoadingDanmuTimeLine />
        {/* 如果在 useMatchAnimeData() 里面没有匹配弹幕库成功， 就会弹出下方对话框，让用户手动匹配*/}
        <MatchAnimeDialog
          matchData={currentMatchedVideo.episodeId ? undefined : matchData}
          onSelected={(params) => {
            // 如果用户选择不加载弹幕
            if (!params) {
              // 保存到历史记录
              saveToHistory({
                hash,
                path: url,
                progress: 0,
                duration: 0,
                animeTitle: name,
              })
              // 如果用户选择不加载弹幕, 就直接开始播放
              return setLoadingProgress(LoadingStatus.START_PLAY)
            }
            // 如果用户手动选择了弹幕库，就使用用户选择的弹幕库，之后就会触发 useDanmuData() 里的 useQuery 和 useEffect
            setCurrentMatchedVideo(params)

            // 因为用户手动选择了弹幕库，所以需要更新 queryClient 的数据, 确保下次加载的时候不会再次弹出对话框
            queryClient.setQueryData([apiClient.match.Matchkeys.postVideoEpisodeId, hash], {
              isMatched: true,
              matches: [{ ...params }],
            })
          }}
          onClosed={clearPlayingVideo}
          isLoading
        />
      </>
    )
  }
  return children
}
