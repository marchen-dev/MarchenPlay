import { useEffect } from 'react'

import { usePlayerInstance } from '../setting/Context'
import { useSubtitle } from '../setting/items/Subtitle'

export const InitializeSubtitle = () => {
  const { initializeSubtitle, subtitlesInstance, isFetching } = useSubtitle()
  const player = usePlayerInstance()

  useEffect(() => {
    if (!player || isFetching) {
      return
    }
    initializeSubtitle()

    return () => {
      subtitlesInstance?.freeTrack()
    }
  }, [player, isFetching])
  return null
}
