import { isWeb } from '@renderer/lib/utils'
import type { FC } from 'react'

import { useXgPlayer } from './hooks'
import { InitializeEvent } from './initialize/Event'
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
      <div ref={playerRef} />
      <PlayerProvider value={playerInstance}>
        <SettingSheet />
        {!isWeb && <InitializeSubtitle />}
        <InitializeEvent />
      </PlayerProvider>
    </>
  )
}
