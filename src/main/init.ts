import path from 'node:path'

import { registerIpcMain } from '@egoist/tipc/main'
import { app, protocol } from 'electron'

import { createStorageFolder } from './constants/app'
import { MARCHEN_PROTOCOL } from './constants/protocol'
import { isDev } from './lib/env'
import { registerAppMenu } from './menu'
import { router } from './tipc'

export const initializeApp = () => {
  registerIpcMain(router)
  registerAppMenu()

  protocol.registerSchemesAsPrivileged([
    {
      scheme: MARCHEN_PROTOCOL,
      privileges: {
        bypassCSP: true,
        stream: true,
        standard: true
      },
    },
  ])
  if (isDev) {
    app.setPath('appData', path.join(app.getPath('appData'), 'Marchen (dev)'))
  }
  createStorageFolder()
}
