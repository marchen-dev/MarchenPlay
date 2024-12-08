import type { MenuItem, MenuItemConstructorOptions } from 'electron'
import { Menu } from 'electron'

import { isMacOS } from '../lib/env'
import { clearData, createSettingWindow, importAnime } from '../windows/setting'

export const registerAppMenu = () => {
  if (!isMacOS) {
    return
  }
  const menu: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: 'Marchen',
      submenu: [
        {
          type: 'normal',
          label: `关于 Marchen Play`,
          click: () => createSettingWindow('关于'),
        },
        { type: 'separator' },
        {
          label: '设置...',
          accelerator: 'CmdOrCtrl+,',
          click: () => createSettingWindow(),
        },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏 Marchen Play' },
        { role: 'hideOthers', label: '隐藏其他' },
        { type: 'separator' },
        {
          label: '清除数据',
          click: clearData,
        },
        { role: 'quit', label: `退出 Marchen Play` },
      ],
    },
    {
      role: 'fileMenu',
      label: '文件',
      submenu: [
        {
          type: 'normal',
          label: '导入动漫',
          click: importAnime,
        },
        { type: 'separator' },
        { role: 'close', label: '关闭' },
      ],
    },
    {
      role: 'viewMenu',
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '切换开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' },
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}


