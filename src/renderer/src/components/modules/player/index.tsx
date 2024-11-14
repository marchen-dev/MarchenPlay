import type { FC } from 'react'

import { useXgPlayer } from './hooks'
import { InitializePlayer } from './init/InitializePlayer'
import { SettingSheet } from './setting/Sheet'

interface PlayerProps {
  url: string
}

export const Player: FC<PlayerProps> = (props) => {
  const { playerRef } = useXgPlayer(props.url)
  return (
    <>
      <div ref={playerRef} />
      <SettingSheet />
      <InitializePlayer />
    </>
  )
}
