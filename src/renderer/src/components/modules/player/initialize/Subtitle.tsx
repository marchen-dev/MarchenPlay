import { isWeb } from '@renderer/lib/utils'
import { useEffect } from 'react'

import { usePlayerInstance } from '../setting/Context'
import { useSubtitle } from '../setting/items/subtitle/hooks'

export const InitializeSubtitle = () => {
  const { initializeSubtitle, subtitlesInstance, isFetching } = useSubtitle()
  const player = usePlayerInstance()

  useEffect(() => {
    if (!player || isFetching || isWeb) {
      return
    }
    initializeSubtitle()

    return () => {
      subtitlesInstance?.freeTrack()
    }
  }, [player, isFetching])
  return null
}
