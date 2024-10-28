import type { FC, PropsWithChildren, ReactNode } from 'react'

import type { ModalContentPropsInternal } from './Context'

export interface ModalProps {
  title?: ReactNode
  overlay?: boolean
  wrapper?: FC
  CustomModalComponent?: FC<PropsWithChildren>
  clickOutsideToDismiss?: boolean
  max?: boolean
  content: FC<ModalContentPropsInternal>
  classNames?: classNamesProps
}

interface classNamesProps {
  modalContainerClassName?: string
  modalClassName?: string
}
