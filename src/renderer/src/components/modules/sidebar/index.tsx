import Show from '@renderer/components/common/Show'
import { Logo } from '@renderer/components/icons/logo'
import { PROJECT_NAME } from '@renderer/constants'
import { useAppTheme } from '@renderer/hooks/theme'
import { cn, isMac } from '@renderer/libs/utils'
import type { SidebarRouteObject } from '@renderer/router'
import { RouteName, siderbarRoutes } from '@renderer/router'
import type { FC } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { showSettingDialog } from '../setting/hooks'
import { DarkModeToggle } from './DarkMode'

export const Sidebar = () => {
  const { isDarkMode } = useAppTheme()
  return (
    <div className="relative flex h-full w-[250px] flex-col justify-between bg-base-200 px-3 pt-2.5">
      <div>
        <div className={cn('drag-region flex items-center', 'justify-between')}>
          <Link to={RouteName.PLAYER} draggable={false} className="cursor-default ">
            <Show when={!isMac}>
              <p className="flex items-center gap-1">
                <Logo className="size-8" fill={isDarkMode ? '#A6ADBB' : '#000'} />
                <span className="font-logo text-lg">{PROJECT_NAME}</span>
              </p>
            </Show>
          </Link>
          <button
            type="button"
            onClick={showSettingDialog}
            className="no-drag-region flex size-8 cursor-default items-center justify-center rounded-md transition-colors hover:bg-base-300"
          >
            <i className="icon-[mingcute--settings-3-line] text-xl" />
          </button>
        </div>
        <nav className="mt-5 flex flex-col gap-2">
          {siderbarRoutes.map((route) => (
            <NavLinkItem {...route} key={route.path} />
          ))}
        </nav>
      </div>
      <DarkModeToggle />
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
