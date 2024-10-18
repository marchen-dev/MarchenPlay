import type { ReactNode } from 'react'

import { Appearance } from './views/Appearance'
import { Player } from './views/Player'

export const settingTabs = [
  {
    title: '外观',
    icon: 'icon-[mingcute--t-shirt-2-line]',
    component: <Appearance />,
  },
  {
    title: '播放器',
    icon: 'icon-[mingcute--play-circle-line]',
    component: <Player />,
  },
]

export interface SettingTabsModel {
  title: string
  icon: string
  component: ReactNode
}
