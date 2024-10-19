import { cn } from '@renderer/lib/utils'
import type { FC, PropsWithChildren, ReactNode } from 'react'

export const SettingViewContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="space-y-6 p-5">{children}</div>
}

interface FieldsCardLayoutProps extends PropsWithChildren {
  title?: ReactNode
  className?: string
}
export const FieldsCardLayout: FC<FieldsCardLayoutProps> = ({ children, title, className }) => {
  return (
    <section className={cn('min-h-32 space-y-2 rounded-lg border bg-base-100 p-3', className)}>
      <p className="mb-1 text-sm font-semibold text-zinc-500">{title}</p>
      {children}
    </section>
  )
}

interface FieldLayoutProps extends PropsWithChildren {
  title?: ReactNode
}

export const FieldLayout: FC<FieldLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex items-center justify-between ">
      <span className="font-medium">{title}</span>
      {children}
    </div>
  )
}
