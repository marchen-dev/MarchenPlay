
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { name } from '@pkg'
import { app, BrowserWindow, protocol } from 'electron'

import { MARCHEN_PROTOCOL } from './constants/protocol'
import { initializeApp } from './init'
import { getIconPath } from './lib/icon'
import createWindow from './windows/main'

function bootstrap() {
  initializeApp()

  app.whenReady().then(() => {
    electronApp.setAppUserModelId(`re.${name}`)

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    protocol.registerFileProtocol(MARCHEN_PROTOCOL, (request, callback) => {
      const path = decodeURIComponent(request.url.slice(`${MARCHEN_PROTOCOL}://`.length))
      callback({ path })
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
