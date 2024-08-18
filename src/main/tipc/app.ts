import { BrowserWindow } from 'electron'

import { t } from './_instance'

export const appRoute = {
  windowAction: t.procedure.input<{ action: 'close' | 'minimize' | 'maximum' }>().action(async ({ context, input }) => {
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
}
