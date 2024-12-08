import path from 'node:path'

import { logPath } from '@main/constants/app'
import logger from 'electron-log'

export const registerLog = () => {
  logger.transports.file.maxSize = 1002430 // 10M
  logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
  logger.transports.file.resolvePathFn = () => path.resolve(logPath(), 'main.log')
}
