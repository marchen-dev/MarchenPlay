import type { ReactNode } from 'react'

import { AboutView } from './views/About'
import { AppearanceView } from './views/Appearance'
import { PlayerView } from './views/Player'

export const settingTabs = [
  {
    title: '外观',
    icon: 'icon-[mingcute--t-shirt-2-line]',
    component: <AppearanceView />,
  },
  {
    title: '播放器',
    icon: 'icon-[mingcute--play-circle-line]',
    component: <PlayerView />,
  },
  {
    title: '关于',
    icon: 'icon-[mingcute--information-line]',
    component: <AboutView />,
  },
]

export interface SettingTabsModel {
  title: string
  icon: string
  component: ReactNode
}
