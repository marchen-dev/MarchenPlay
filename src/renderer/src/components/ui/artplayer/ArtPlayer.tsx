import Artplayer from 'artplayer'
import type {
  ComponentPropsWithoutRef,
  FC,
} from 'react'
import { useEffect, useRef } from 'react'

interface PlayerProps extends ComponentPropsWithoutRef<'div'> {
  option: Omit<Artplayer['Option'], 'container'>
  getInstance?: (art: Artplayer) => void
}
export const ArtPlayer: FC<PlayerProps> = ({ option, getInstance, ...rest }) => {
  const artRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (artRef.current === null) {
      return
    }
    const art = new Artplayer({
      ...option,
      container: artRef.current,
    })
    art.on('ready', () => {
      art.fullscreenWeb = true
    })

    art.on('resize', () => {
      art.plugins.artplayerPluginDanmuku.reset()
    })

    art.on('video:seeked',()=>{
      art.plugins.artplayerPluginDanmuku.reset()
    })

    if (getInstance && typeof getInstance === 'function') {
      getInstance(art)
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false)
      }
    }
  }, [])

  return <div ref={artRef} {...rest} />
}
