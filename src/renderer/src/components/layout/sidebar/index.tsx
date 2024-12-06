import { updateProgressAtom, useNetworkStatus } from '@renderer/atoms/network'
import { useAppSettingsValue } from '@renderer/atoms/settings/app'
import Show from '@renderer/components/common/Show'
import { Logo } from '@renderer/components/icons/Logo'
import { Alert, AlertDescription, AlertTitle } from '@renderer/components/ui/alert'
import { Button } from '@renderer/components/ui/button'
import { Progress } from '@renderer/components/ui/progress'
import { PROJECT_NAME } from '@renderer/constants'
import { tipcClient } from '@renderer/lib/client'
import { getStorageNS } from '@renderer/lib/ns'
import { cn, isMac } from '@renderer/lib/utils'
import type { SidebarRouteObject } from '@renderer/router'
import { RouteName, siderbarRoutes } from '@renderer/router'
import { useAtomValue } from 'jotai'
import { AlertCircle } from 'lucide-react'
import type { FC } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

import { useSettingModal } from '../../modules/settings/hooks'

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
                <span className="font-logo text-lg font-bold">{PROJECT_NAME}</span>
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
        <UpdateProgress />
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

export const UpdateProgress = () => {
  const update = useAtomValue(updateProgressAtom)
  const appSettingsValue = useAppSettingsValue()
  if (!update) {
    return
  }

  if (update.status === 'downloading') {
    return (
      <div className="space-y-1.5 text-zinc-700">
        <p className="text-sm">发现新版本，正在下载更新...</p>
        <Progress className="h-2" value={update?.progress || 0} />
      </div>
    )
  }

  return (
    <div className="text-center">
      <Button
        variant="outline"
        onClick={() => {
          // 这里执行 tipcClient?.installUpdate() 会立即退出程序安装更新，所以更新 localStorage 只能用 localStorage.setItem, 用 atom 更新不及时
          localStorage.setItem(
            getStorageNS('app'),
            JSON.stringify({ ...appSettingsValue, showUpdateNote: true }),
          )
          tipcClient?.installUpdate()
        }}
      >
        <i className="icon-[mingcute--entrance-line] text-lg" />
        <span className="ml-1">安装新版本</span>
      </Button>
    </div>
  )
}
