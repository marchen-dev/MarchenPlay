import { ScrollArea } from '@renderer/components/ui/scrollArea'
import { cn } from '@renderer/lib/utils'
import type { FC } from 'react'

import { setCurrentSetting, useCurrentSetting } from './provider'
import type { SettingTabsModel } from './tabs'
import { settingTabs } from './tabs'

export const SettingModal = () => {
  const { component } = useCurrentSetting()
  return (
    <div className="flex h-full">
      <div className="w-[140px]">
        <ul className="space-y-2">
          {settingTabs.map((tab) => (
            <SettingTabItem key={tab.title} {...tab} />
          ))}
        </ul>
      </div>
      <div className="mx-3 w-px bg-base-300" />
      <div className="flex-1">
        <ScrollArea>{component}</ScrollArea>
      </div>
    </div>
  )
}

export const SettingTabItem: FC<SettingTabsModel> = (props) => {
  const { icon, title } = props
  const { title: currentTitle } = useCurrentSetting()
  return (
    <li
      className={cn(
        'flex  cursor-default items-center gap-1 px-3 py-1',
        title === currentTitle && 'rounded-lg bg-base-200',
      )}
      onClick={() => setCurrentSetting(props)}
    >
      <i className={cn(icon, 'text-xl')} />
      <span>{title}</span>
    </li>
  )
}

export const ModalTitle = () => {
  return (
    <h4 className="flex items-center gap-1">
      <i className="icon-[mingcute--settings-7-line] text-xl" />
      <span>设置</span>
    </h4>
  )
}
