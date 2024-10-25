import { registerIpcMain } from '@egoist/tipc/main'
import { protocol } from 'electron'

import { MARCHEN_PROTOCOL } from './constants/protocol'
import { appUpdater } from './lib/update'
import { registerAppMenu } from './menu'
import { router } from './tipc'

export const initializeApp = () => {
  registerIpcMain(router)
  appUpdater.autoUpdate()
  registerAppMenu()

    protocol.registerSchemesAsPrivileged([
      {
        scheme: MARCHEN_PROTOCOL,
        privileges: {
          bypassCSP: true,
          stream: true,
          standard: true,
        },
      },
    ])
}
