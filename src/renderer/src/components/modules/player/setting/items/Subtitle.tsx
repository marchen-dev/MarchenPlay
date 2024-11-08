import { videoAtom } from '@renderer/atoms/player'
import { Button } from '@renderer/components/ui/button'
import { tipcClient } from '@renderer/lib/client'
import { useAtomValue } from 'jotai'

export const Subtitle = () => {
  const video = useAtomValue(videoAtom)
  return (
    <div>
      <Button
        onClick={async () => {
          await tipcClient?.extractSubtitlesFromAnime({ path: video.url })
        }}
      >
        字幕
      </Button>
    </div>
  )
}
