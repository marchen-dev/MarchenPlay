import { useNetworkStatus } from '@renderer/atoms/network'
import Show from '@renderer/components/common/Show'
import { Logo } from '@renderer/components/icons/Logo'
import { Alert, AlertDescription, AlertTitle } from '@renderer/components/ui/alert'
import { PROJECT_NAME } from '@renderer/constants'
import { cn, isMac } from '@renderer/lib/utils'
import type { SidebarRouteObject } from '@renderer/router'
import { RouteName, siderbarRoutes } from '@renderer/router'
import { AlertCircle } from 'lucide-react'
import type { FC } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { useSettingModal } from '../settings/hooks'

export const Sidebar = () => {
  const showModal = useSettingModal()
  return (
    <div className="relative flex h-full w-[250px] flex-col justify-between bg-base-200 px-3 pt-2.5">
      <div>
        <div className={cn('drag-region flex items-center', 'justify-between')}>
          <Link to={RouteName.PLAYER} draggable={false} className="cursor-default ">
            <Show when={!isMac}>
              <p className="flex items-center gap-1">
                <Logo clasNames={{ icon: 'size-8' }} />
                <span className="font-logo text-lg">{PROJECT_NAME}</span>
              </p>
            </Show>
          </Link>
          <button
            type="button"
            onClick={() => showModal()}
            className="no-drag-region flex size-8 cursor-default items-center justify-center rounded-md transition-colors hover:bg-base-300"
          >
            <i className="icon-[mingcute--settings-3-line] text-xl" />
          </button>
        </div>
        <nav className="mt-5 flex select-none flex-col gap-2">
          {siderbarRoutes.map((route) => (
            <NavLinkItem {...route} key={route.path} />
          ))}
        </nav>
      </div>
      <div className="mb-3">
        <NetWorkCheck />
      </div>
    </div>
  )
}

const NavLinkItem: FC<SidebarRouteObject> = ({ path, meta }) => {
  const { pathname } = useLocation()
  if (!meta || !path) {
    return null
  }
  const { title, icon } = meta
  return (
    <NavLink
      draggable={false}
      to={path}
      className={cn(pathname === path && 'rounded-md bg-base-300')}
    >
      <p className="flex cursor-default items-center gap-1.5 p-2">
        <i className={cn(icon, 'text-xl')} />
        <span>{title}</span>
      </p>
    </NavLink>
  )
}

export const NetWorkCheck = () => {
  const status = useNetworkStatus()
  if (status) {
    return null
  }
  return (
    <Alert style={{ fontWeight: 500 }} variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>网络异常</AlertTitle>
      <AlertDescription>部分功能使用受限</AlertDescription>
    </Alert>
  )
}
