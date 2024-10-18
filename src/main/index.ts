import { registerIpcMain } from '@egoist/tipc/main'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'

import { getIconPath } from './lib/icon'
import { appUpdater } from './lib/update'
import { registerAppMenu } from './menu'
import { router } from './tipc'
import createWindow from './windows/main'

function bootstrap() {
  registerIpcMain(router)
  appUpdater.autoUpdate()
  registerAppMenu()
  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    if (app.dock) {
      app.dock.setIcon(getIconPath())
    }

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

bootstrap()
