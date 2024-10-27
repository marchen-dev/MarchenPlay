import { getRendererHandlers as getAppRendererHandlers } from '@egoist/tipc/main'
import { clearAllData } from '@main/lib/cleaner'
import { dialog } from 'electron'

import type { RendererHandlers } from '../tipc/renderer-handlers'
import { getMainWindow } from './main'

const getRendererHandlers = () => {
  const mainWindow = getMainWindow()
  if (!mainWindow) {
    return
  }
  return getAppRendererHandlers<RendererHandlers>(mainWindow.webContents)
}

export const createSettingWindow = () => {
  const handlers = getRendererHandlers()
  handlers?.showSetting.send()
}

export const clearData = async () => {
  const win = getMainWindow()
  if (!win) {
    return
  }

  const result = await dialog.showMessageBox({
    type: 'warning',
    message: '是否清除全部数据',
    buttons: ['取消', '确定'],
  })
  if (!result) {
    return
  }

  return clearAllData()
}
