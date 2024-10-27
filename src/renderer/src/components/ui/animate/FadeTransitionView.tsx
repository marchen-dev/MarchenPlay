import { m } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'

const FadeTransitionView: FC<PropsWithChildren> = ({ children }) => {
  return (
    <m.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="h-full">
      {children}
    </m.div>
  )
}

export default FadeTransitionView
