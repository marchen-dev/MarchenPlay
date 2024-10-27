import { AnimatePresence } from 'framer-motion'
import * as React from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

const AnimatedOutlet = (): React.JSX.Element => {
  const location = useLocation()
  const element = useOutlet()

  return (
    <AnimatePresence mode="wait" initial={true}>
      {element && React.createElement(element.type, { ...element.props, key: location.pathname })}
    </AnimatePresence>
  )
}

export default AnimatedOutlet
