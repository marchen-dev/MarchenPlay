import { atom, useSetAtom } from 'jotai'
import { atomWithReset, useResetAtom } from 'jotai/utils'

export const videoAtom = atomWithReset({
  url: '',
  hash: '',
  size: 0,
  name: '',
})

export enum LoadingStatus {
  IMPORT_VIDEO = 0,
  CALC_HASH = 1,
  MATCH_ANIME = 2,
  GET_DANMU = 3,
  READY_PLAY = 4,
  START_PLAY = 5,
}

export const loadingDanmuProgressAtom = atomWithReset<LoadingStatus | null>(null)

export const initialMatchedVideo = {
  episodeId: 0,
  animeTitle: '',
  episodeTitle: '',
  animeId: 0,
}
export type MatchedVideoType = typeof initialMatchedVideo

export const currentMatchedVideoAtom = atomWithReset<MatchedVideoType>(initialMatchedVideo)

export const isLoadDanmakuAtom = atom((get) => get(currentMatchedVideoAtom).episodeId !== 0)
export const useSetLoadingDanmuProgress = () => useSetAtom(loadingDanmuProgressAtom)

export const useClearPlayingVideo = () => {
  const resetVideo = useResetAtom(videoAtom)
  const resetProgress = useResetAtom(loadingDanmuProgressAtom)

  return () => {
    resetVideo()
    resetProgress()
  }
}
