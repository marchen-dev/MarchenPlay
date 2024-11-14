import { Player } from '@renderer/components/modules/player'
import { useVideo } from '@renderer/components/modules/player/loading/hooks'
import { VideoProvider } from '@renderer/components/modules/player/loading/PlayerProvider'
import { cn, isWeb } from '@renderer/lib/utils'
import type { FC } from 'react'
import { useCallback, useMemo, useRef } from 'react'

export default function VideoPlayer() {
  const { importAnimeViaIPC, importAnimeViaBrowser, url, showAddVideoTips } = useVideo()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const manualImport = useCallback(() => {
    if (isWeb) {
      return fileInputRef.current?.click()
    }
    importAnimeViaIPC()
  }, [importAnimeViaIPC])

  const content = useMemo(
    () => (url ? <Player url={url} /> : <DragTips onClick={manualImport} />),
    [url, manualImport],
  )

  return (
    <VideoProvider>
      <div
        onDrop={importAnimeViaBrowser}
        onDragOver={(e) => e.preventDefault()}
        className={cn('flex size-full items-center justify-center ')}
      >
        {content}
        {showAddVideoTips && (
          <input
            type="file"
            accept="video/mp4, video/x-matroska"
            ref={fileInputRef}
            onChange={importAnimeViaBrowser}
            className="hidden"
          />
        )}
      </div>
    </VideoProvider>
  )
}

const DragTips: FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="flex flex-col items-center gap-2 p-32 text-gray-500" onClick={onClick}>
    <i className="icon-[mingcute--video-line] text-6xl " />
    <p className="select-none text-xl">点击或拖拽动漫到此处播放</p>
  </div>
)
