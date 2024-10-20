import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { RootLayout } from './components/layout/RootLayout'
import { Sidebar } from './components/modules/sidebar'
import { Titlebar } from './components/modules/windows/Titlebar'
import { appLog } from './lib/log'
import { cn, isWeb, isWindows } from './lib/utils'
import { RootProviders } from './providers'
import { TipcListener } from './providers/TipcListener'

function App(): JSX.Element {
  return (
    <RootProviders>
      <Prepare />

      <RootLayout>
        <Sidebar />
        <Content />
        <TipcListener />
      </RootLayout>
    </RootProviders>
  )
}

const Prepare = () => {
  useEffect(() => {
    const doneTime = Math.trunc(performance.now())

    appLog('App is ready', `${doneTime}ms`)
  }, [])

  if (isWeb) {
    return
  }
  return (
    <div
      className={cn(
        'drag-region absolute inset-x-0 top-0 h-12 shrink-0',
        isWindows && 'pointer-events-none z-[9999]',
      )}
      aria-hidden
    >
      {isWindows && <Titlebar />}
    </div>
  )
}

const Content = () => (
  <main className="flex-1">
    <Outlet />
  </main>
)
export default App
