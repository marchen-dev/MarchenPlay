import { Player } from '@renderer/components/modules/player'
import { useVideo } from '@renderer/components/modules/player/hooks'
import { cn } from '@renderer/lib/utils'
import { VideoProvider } from '@renderer/providers/player/PlayerProvider'
import type { FC } from 'react'
import { useMemo, useRef } from 'react'

export default function VideoPlayer() {
  const { handleDragOver, handleNewVideo, url, showAddVideoTips } = useVideo()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const clickImportvideo = () => fileInputRef.current?.click()
  const content = useMemo(
    () => (url ? <Player url={url} /> : <DragTips onClick={clickImportvideo} />),
    [url],
  )
  return (
    <VideoProvider>
      <div
        onDrop={handleNewVideo}
        onDragOver={handleDragOver}
        className={cn('flex size-full items-center justify-center ')}
      >
        {content}
        {showAddVideoTips && (
          <input
            type="file"
            accept="video/mp4, video/x-matroska"
            ref={fileInputRef}
            onChange={handleNewVideo}
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
