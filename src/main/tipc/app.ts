import { BrowserWindow, dialog } from 'electron'

import { appUpdater } from '../lib/update'
import { t } from './_instance'

export const appRoute = {
  windowAction: t.procedure
    .input<{ action: 'close' | 'minimize' | 'maximum' }>()
    .action(async ({ context, input }) => {
      const webcontent = context.sender

      const window = BrowserWindow.fromWebContents(webcontent)
      if (!window) return

      switch (input.action) {
        case 'close': {
          window.close()
          break
        }
        case 'minimize': {
          window.minimize()
          break
        }
        case 'maximum': {
          if (window.isMaximized()) {
            window.unmaximize()
          } else {
            window.maximize()
          }
          break
        }
      }
    }),
  checkUpdate: t.procedure.action(async () => {
    appUpdater.instance.checkForUpdates()
  }),
  clearHistoryDialog: t.procedure.input<{ title: string }>().action(async ({ input }) => {
    const result = await dialog.showMessageBox({
      type: 'warning',
      message: input.title,
      buttons: ['取消', '确定'],
    })
    return !!result.response
  }),
}
