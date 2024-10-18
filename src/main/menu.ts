import { name } from '@pkg'
import type {MenuItem, MenuItemConstructorOptions} from 'electron';
import { Menu   } from 'electron'

import { isMacOS } from './lib/env'
import { createSettingWindow } from './windows/setting'

export const registerAppMenu = () => {
  if (!isMacOS) {
    return
  }
  const menu: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: name,
      submenu: [
        {
          label: 'Settings...',
          accelerator: 'CmdOrCtrl+,',
          click: () => createSettingWindow(),
        },
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}
