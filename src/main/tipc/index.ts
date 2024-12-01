import { appRoute } from './app'
import { playerRoute } from './player'
import { settingRoute } from './setting'
import { utilsRoute } from './utils'

export const router = {
  ...settingRoute,
  ...appRoute,
  ...playerRoute,
  ...utilsRoute,
}

export type Router = typeof router
