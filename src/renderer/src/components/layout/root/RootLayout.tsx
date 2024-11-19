import type { FC, PropsWithChildren } from 'react'

export const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex h-screen overflow-hidden">{children}</div>
)
