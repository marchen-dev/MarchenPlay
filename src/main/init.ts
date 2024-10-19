import { registerIpcMain } from "@egoist/tipc/main"

import { appUpdater } from "./lib/update"
import { registerAppMenu } from "./menu"
import { router } from "./tipc"

export const initializeApp = ()=>{
  
  registerIpcMain(router)
  appUpdater.autoUpdate()
  registerAppMenu()
}