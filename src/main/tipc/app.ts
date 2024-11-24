import { getMainWindow } from '@main/windows/main'
import { version } from '@pkg'
import { BrowserWindow, dialog } from 'electron'
import updater from 'electron-updater'

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
    const updateCheckResult = await updater.autoUpdater.checkForUpdates()
    if (updateCheckResult?.updateInfo.version === version) {
      dialog.showMessageBox({
        type: 'info',
        message: '当前已是最新版本',
      })
    }

    const releaseNotes = updateCheckResult?.updateInfo.releaseNotes
    let releaseContent = ''

    if (releaseNotes) {
      if (typeof releaseNotes === 'string') {
        releaseContent = releaseNotes
      } else if (Array.isArray(releaseNotes)) {
        releaseNotes.forEach((releaseNote) => {
          releaseContent += `${releaseNote}\n`
        })
      }
    } else {
      releaseContent = '暂无更新说明'
    }

    dialog.showMessageBox({
      type: 'info',
      detail: releaseContent,
      message: '发现新版本，正在下载更新...',
    })
  }),
  installUpdate: t.procedure.action(async () => {
    updater.autoUpdater.quitAndInstall()
  }),
  clearHistoryDialog: t.procedure.input<{ title: string }>().action(async ({ input }) => {
    const result = await dialog.showMessageBox({
      type: 'warning',
      message: input.title,
      buttons: ['取消', '确认'],
    })
    return !!result.response
  }),
  restart: t.procedure.action(async () => {
    getMainWindow()?.reload()
    return
  }),
}
