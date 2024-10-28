import type { FC, PropsWithChildren } from 'react'

import type { TransitionViewProps } from './CreateTranstion'
import { createTransition } from './CreateTranstion'

const FadeTransitionView: FC<PropsWithChildren<TransitionViewProps>> = createTransition({
  from: { opacity: 0 },
  to: { opacity: 1 },
})
export default FadeTransitionView
