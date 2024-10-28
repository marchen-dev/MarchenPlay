import type * as TogglePrimitive from '@radix-ui/react-toggle'
import type { ButtonProps } from '@renderer/components/ui/button'
import { Button } from '@renderer/components/ui/button'
import { Toggle } from '@renderer/components/ui/toggle'
import type { FC, PropsWithChildren } from 'react'

export const FunctionAreaButton: FC<PropsWithChildren & ButtonProps> = ({ children, ...props }) => {
  return (
    <Button variant="icon" size="sm" className="text-xl" {...props}>
      {children}
    </Button>
  )
}

export const FunctionAreaToggle: FC<
  PropsWithChildren & React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
> = ({ children, ...props }) => {
  return (
    <Toggle size="sm" className="text-xl" {...props}>
      {children}
    </Toggle>
  )
}
