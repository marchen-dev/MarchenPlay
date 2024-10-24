import { useCurrentRoute } from '@renderer/router'
import type { FC, PropsWithChildren } from 'react'

import { ScrollArea } from '../ui/scrollArea'

export const RouterLayout: FC<PropsWithChildren> = ({ children }) => {
  const currentRoute = useCurrentRoute()
  return (
    <div className="mt-6 h-full space-y-3 px-8">
      <section>
        <h3 className="border-b pb-3 text-2xl font-medium">{currentRoute?.meta.title}</h3>
      </section>
      <ScrollArea>{children}</ScrollArea>
    </div>
  )
}
