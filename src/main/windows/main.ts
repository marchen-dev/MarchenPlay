import { join } from 'node:path'

import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'

import icon from '../../../resources/icon.png?asset'

const { platform } = process

const isDev = process.env.NODE_ENV === 'development'

export default function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    // alwaysOnTop:true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
    backgroundMaterial: 'mica',
    titleBarStyle: platform === 'win32' ? 'hidden' : 'hiddenInset',
    trafficLightPosition: {
      x: 18,
      y: 18,
    },
  })

  mainWindow.on('ready-to-show', () => {
    isDev ? mainWindow.showInactive() : mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  // mainWindow.webContents.userAgent = 'dandanplay-test/android 1.2.3'
  return mainWindow
}
