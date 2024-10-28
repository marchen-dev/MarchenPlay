import { RouteName, useCurrentRoute } from '@renderer/router'
import type { FC, PropsWithChildren, ReactNode } from 'react'

import FadeTransitionView from '../ui/animate/FadeTransitionView'

interface RouterLayoutProps extends PropsWithChildren {
  FunctionArea?: ReactNode
}

export const RouterLayout: FC<RouterLayoutProps> = ({ children, FunctionArea }) => {
  const currentRoute = useCurrentRoute()
  if (currentRoute?.path === RouteName.PLAYER) {
    return
  }
  return (
    <div className="relative flex h-full flex-col space-y-4 pt-7">
      <section className="mx-8 flex h-12 items-center justify-between overflow-hidden border-b pb-2.5 dark:border-zinc-600">
        <h3 className="align-middle text-2xl font-medium">{currentRoute?.meta.title}</h3>
        {FunctionArea}
      </section>
      <FadeTransitionView>{children}</FadeTransitionView>
    </div>
  )
}
