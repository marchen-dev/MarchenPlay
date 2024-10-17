import { m } from 'framer-motion'
import type { FC, ForwardedRef} from 'react';
import { forwardRef } from 'react'

import { RootPortal } from '../../portal'

interface ModalOverlayProps {
  zIndex?: number
}
export const ModalOverlay: FC<ModalOverlayProps> = forwardRef(
  (props, ref: ForwardedRef<HTMLDivElement>) => {
    const { zIndex } = props
    return (
      <RootPortal>
        <m.div
          id="modal-overlay"
          className="pointer-events-none fixed inset-0 z-[119999] bg-zinc-50/80 dark:bg-neutral-900/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex }}
          ref={ref}
        />
      </RootPortal>
    )
  },
)
