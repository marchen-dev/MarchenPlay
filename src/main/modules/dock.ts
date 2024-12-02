import { app, Menu } from 'electron'

// TODO 为 app dock 添加菜单
export const registerAppDock = () => {
  const dockMenu = Menu.buildFromTemplate([
    {
      label: '1111',
    },
    {
      label: '2222',
    },
    {
      label: '3333',
    }
  ])
  app.dock.setMenu(dockMenu)
}
