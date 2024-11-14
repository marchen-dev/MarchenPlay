import type { PlayerType } from '@renderer/components/modules/player/hooks'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithReset, selectAtom, useResetAtom } from 'jotai/utils'
import type SubtitlesOctopus from 'libass-wasm'
import { useMemo } from 'react'

import * as store from './store'

export const videoAtom = atomWithReset<{
  url: string
  hash: string
  size: number
  name: string
  player?: PlayerType | null
  subtitlesOctopus?: SubtitlesOctopus | null
}>({
  url: '',
  hash: '',
  size: 0,
  name: '',
  player: null,
  subtitlesOctopus: null,
})

export const usePlayer = () =>
  useAtomValue(useMemo(() => selectAtom(videoAtom, (atomValue) => atomValue.player), []))

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

export const playerSettingSheetAtom = atom(false)

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

export const showPlayerSettingSheet = () => store.jotaiStore.set(playerSettingSheetAtom, true)
