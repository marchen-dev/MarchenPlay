import { getRendererHandlers } from '@egoist/tipc/main'

import type { RendererHandlers } from '../tipc/renderer-handlers'
import { getMainWindow } from './main'

export const createSettingWindow = () => {
  const mainWindow = getMainWindow()
  if (!mainWindow) {
    return
  }
  const handlers = getRendererHandlers<RendererHandlers>(mainWindow.webContents)
  handlers.showSetting.send()
}
