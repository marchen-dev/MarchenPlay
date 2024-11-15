import { videoAtom } from '@renderer/atoms/player'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { useSubtitle } from '../setting/items/Subtitle'

export const InitializeSubtitle = () => {
  const { initializeSubtitle, subtitlesData } = useSubtitle()
  const { player } = useAtomValue(videoAtom)

  useEffect(() => {
    if (!player) {
      return
    }
    initializeSubtitle()
  }, [subtitlesData, player])
  return null
}
