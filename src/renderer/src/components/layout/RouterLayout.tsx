import { useCurrentRoute } from '@renderer/router'
import type { FC, PropsWithChildren } from 'react'

export const RouterLayout: FC<PropsWithChildren> = ({ children }) => {
  const currentRoute = useCurrentRoute()
  return (
    <div className="relative h-full space-y-3 pt-6">
      <section className='px-8'>
        <h3 className="border-b pb-3 text-2xl font-medium">{currentRoute?.meta.title}</h3>
      </section>
      {children}
    </div>
  )
}
