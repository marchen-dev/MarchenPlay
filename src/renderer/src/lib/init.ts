import { subscribeNetWorkStatus } from '@renderer/atoms/network'

export const initializeApp = () => {
  subscribeNetWorkStatus()
}
