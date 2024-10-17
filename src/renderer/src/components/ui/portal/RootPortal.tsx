import type { FC, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

export const RootPortal: FC<PropsWithChildren> = ({ children }) => {
  return createPortal(children, document.body)
}
