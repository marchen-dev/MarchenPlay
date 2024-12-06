import { AnimatePresence } from 'framer-motion'
import * as React from 'react'
import { useLocation, useOutlet } from 'react-router'

const AnimatedOutlet = (): React.JSX.Element => {
  const location = useLocation()
  const element = useOutlet()

  return (
    <AnimatePresence mode="wait" initial={true}>
      {element &&
        React.createElement(element.type, {
          ...(typeof element.props === 'object' ? element.props : {}),
          key: location.pathname,
        })}
    </AnimatePresence>
  )
}

export default AnimatedOutlet
