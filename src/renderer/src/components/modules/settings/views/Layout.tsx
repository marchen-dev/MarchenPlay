import { cn } from '@renderer/lib/utils'
import type { FC, PropsWithChildren, ReactNode } from 'react'

import { useCurrentSetting } from '../provider'

export const SettingViewContainer: FC<PropsWithChildren> = ({ children }) => {
  const { title, icon } = useCurrentSetting()
  return (
    <div className="space-y-4 p-5">
      <p className="flex items-center gap-1">
        <i className={cn(icon, 'size-6')} />
        <span className='font-medium" text-lg'>{title}</span>
      </p>
      {children}
    </div>
  )
}

interface FieldsCardLayoutProps extends PropsWithChildren {
  title?: ReactNode
  className?: string
}
export const FieldsCardLayout: FC<FieldsCardLayoutProps> = ({ children, title, className }) => {
  return (
    <section
      className={cn(
        'min-h-28 space-y-3 rounded-lg border  bg-zinc-50 p-3 dark:bg-zinc-900',
        className,
      )}
    >
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
