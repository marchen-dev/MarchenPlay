import 'dayjs/locale/zh-cn'

import { subscribeNetWorkStatus } from '@renderer/atoms/network'

import { initializeDayjs } from './date'

export const initializeApp = () => {
  subscribeNetWorkStatus()
  initializeDayjs()
}
