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
  MARCH_ANIME = 2,
  GET_DANMU = 3,
  READY_PLAY = 4,
  START_PLAY = 5,
}

export const loadingDanmuProgressAtom = atomWithReset<LoadingStatus | null>(null)

export const currentMatchedVideoAtom = atomWithReset({
  episodeId: 0,
  animeTitle: '',
})

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
