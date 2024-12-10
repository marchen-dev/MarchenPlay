import { isWeb } from '@renderer/lib/utils'
import { useEffect } from 'react'

import { usePlayerInstance, useSubtitleInstance } from '../Context'
import { useSubtitle } from '../setting/items/subtitle/hooks'

export const InitializeSubtitle = () => {
  const { initializeSubtitle, subtitlesInstance, isFetching } = useSubtitle()
  const player = usePlayerInstance()
  const [subtitle] = useSubtitleInstance()

  useEffect(() => {
    if (!player || isFetching || isWeb || subtitle) {
      return
    }

    initializeSubtitle()
    return () => {
      subtitlesInstance?.freeTrack()
    }
  }, [player, isFetching])
  return null
}
