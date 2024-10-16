'use client'

import { loadingDanmuProgressAtom, LoadingStatus } from '@renderer/atoms/player'
import { cn } from '@renderer/lib/utils'
import { useAtomValue } from 'jotai'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'
import { useToast } from './use-toast'

export function Toaster() {
  const { toasts } = useToast()
  const loadingProgress = useAtomValue(loadingDanmuProgressAtom)
  const videoPlaying = loadingProgress === LoadingStatus.START_PLAY
  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      {/* 防止弹窗遮住视频进度条 */}
      <ToastViewport className={cn(videoPlaying && 'sm:bottom-14')} />
    </ToastProvider>
  )
}
