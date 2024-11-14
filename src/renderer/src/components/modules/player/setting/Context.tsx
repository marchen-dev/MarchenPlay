import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

import type { PlayerType } from '../hooks'

const PlayerContext = createContext<PlayerType | null>(null)

export const PlayerProvider: FC<PropsWithChildren<{ value: PlayerType | null }>> = ({
  value,
  children,
}) => {
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export const usePlayer = () => {
  const player = useContext(PlayerContext)
  return player
}
