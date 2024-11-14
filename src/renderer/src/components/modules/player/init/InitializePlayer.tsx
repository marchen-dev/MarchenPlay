import { useEffect } from 'react'

import { useSubtitle } from '../setting/items/Subtitle'

export const InitializePlayer = () => {
  const { subtitlesData, fetchSubtitleBody } = useSubtitle()

  useEffect(() => {
    if (subtitlesData?.defaultId !== undefined && subtitlesData?.defaultId !== -1) {
      fetchSubtitleBody(subtitlesData.defaultId.toString())
    }
  }, [subtitlesData?.defaultId])
  return null
}
