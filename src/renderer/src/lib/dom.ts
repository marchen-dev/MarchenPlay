import type { ReactEventHandler } from 'react'

export const nextFrame = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn))

export const stopPropagation: ReactEventHandler<any> = (e) => e.stopPropagation()
