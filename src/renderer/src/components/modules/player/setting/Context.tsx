import type SubtitlesOctopus from 'libass-wasm'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import type { PlayerType } from '../hooks'

interface PlayerContextProps {
  subtitlesInstance: [
    SubtitlesOctopus | null,
    React.Dispatch<React.SetStateAction<SubtitlesOctopus | null>>,
  ]
  playerInstance?: PlayerType | null
}

const PlayerContext = createContext<PlayerContextProps | null>(null)

export const PlayerProvider: FC<PropsWithChildren<{ value: PlayerType | null }>> = ({
  value,
  children,
}) => {
  const subtitlesInstance = useState<SubtitlesOctopus | null>(null)

  const contextValue = useMemo(() => {
    return { playerInstance: value, subtitlesInstance }
  }, [value, subtitlesInstance])

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>
}

export const usePlayerInstance = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayerInstance must be used within a PlayerProvider')
  }
  return context.playerInstance
}

export const useSubtitleInstance = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('useSubtitleInstance must be used within a PlayerProvider')
  }
  return context.subtitlesInstance
}
