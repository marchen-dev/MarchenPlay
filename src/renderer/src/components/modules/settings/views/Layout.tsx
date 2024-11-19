import { cn } from '@renderer/lib/utils'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { forwardRef } from 'react'

export const SettingViewContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="space-y-4 p-5">{children}</div>
}

interface FieldsCardLayoutProps extends PropsWithChildren {
  title?: ReactNode
  className?: string
}
export const FieldsCardLayout: FC<FieldsCardLayoutProps> = ({ children, title, className }) => {
  return (
    <section
      className={cn(
        'min-h-28 space-y-3 rounded-lg border bg-zinc-50 p-3 dark:bg-zinc-900',
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

export const FieldLayout = forwardRef<HTMLDivElement, FieldLayoutProps>(
  ({ children, title }, ref) => {
    return (
      <div className="flex items-center justify-between " ref={ref}>
        <span className="font-medium">{title}</span>
        {children}
      </div>
    )
  },
)
