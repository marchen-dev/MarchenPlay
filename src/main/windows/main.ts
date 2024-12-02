import { join } from 'node:path'

import { is } from '@electron-toolkit/utils'
import { isVideoFile } from '@main/lib/utils'
import { BrowserWindow, shell } from 'electron'
import logger from 'electron-log'

import { getIconPath } from '../lib/icon'
import { getRendererHandlers } from './setting'

const { platform } = process

const isDev = process.env.NODE_ENV === 'development'

const windows = {
  mainWindow: null as BrowserWindow | null,
}

globalThis['windows'] = windows
export default function createWindow() {
  // Create the browser window.
  const baseWindowsConfig: Electron.BrowserWindowConstructorOptions = {
    width: 1200,
    height: 900,
    minWidth: 800, // 设置最小宽度
    minHeight: 650, // 设置最小高度
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      // webSecurity: false, // 禁用 webSecurity 以允许加载本地文件资源
    },
  }
  switch (platform) {
    case 'darwin': {
      Object.assign(baseWindowsConfig, {
        trafficLightPosition: {
          x: 18,
          y: 18,
        },
        titleBarStyle: 'hiddenInset',
      } as Electron.BrowserWindowConstructorOptions)
      break
    }
    case 'win32': {
      Object.assign(baseWindowsConfig, {
        titleBarStyle: 'hidden',
        backgroundMaterial: 'mica',
        icon: getIconPath(),
      } as Electron.BrowserWindowConstructorOptions)
      break
    }
    default: {
      Object.assign(baseWindowsConfig, {
        icon: getIconPath(),
      } as Electron.BrowserWindowConstructorOptions)
    }
  }

  windows.mainWindow = new BrowserWindow(baseWindowsConfig)
  const { mainWindow } = windows

  mainWindow.on('ready-to-show', () => {
    isDev ? mainWindow.showInactive() : mainWindow.show()

    quickLaunchViaVideo()
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

// 通过视频文件快捷打开
function quickLaunchViaVideo() {
  const { argv } = process
  const filePath = argv.at(-1)
  if (!filePath) {
    return
  }
  if (isVideoFile(filePath)) {
    logger.info('[app] windows open File', filePath)
    getRendererHandlers()?.importAnime.send({ path: filePath })
  }
}

export const getMainWindow = () => windows.mainWindow
