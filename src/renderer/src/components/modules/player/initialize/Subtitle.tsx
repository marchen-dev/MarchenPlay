import { useEffect } from 'react'

import { usePlayerInstance } from '../setting/Context'
import { useSubtitle } from '../setting/items/Subtitle'

export const InitializeSubtitle = () => {
  const { initializeSubtitle, subtitlesData } = useSubtitle()
  const player = usePlayerInstance()
  useEffect(() => {
    if (!player) {
      return
    }

    initializeSubtitle()
  }, [subtitlesData, player])
  return null
}
