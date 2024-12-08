import { isWeb } from '@renderer/lib/utils'
import { m } from 'framer-motion'
import type { FC } from 'react'

import { InitializeEvent } from './initialize/Event'
import { useXgPlayer } from './initialize/hooks'
import { InitializeSubtitle } from './initialize/Subtitle'
import { PlayerProvider } from './setting/Context'
import { SettingSheet } from './setting/Sheet'

interface PlayerProps {
  url: string
}

export const Player: FC<PlayerProps> = (props) => {
  const { playerRef, playerInstance } = useXgPlayer(props.url)
  return (
    <>
      <m.div
        ref={playerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <PlayerProvider value={playerInstance}>
        <SettingSheet />
        {!isWeb && <InitializeSubtitle />}
        <InitializeEvent />
      </PlayerProvider>
    </>
  )
}
