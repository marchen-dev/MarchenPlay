import path from 'node:path'

import { app } from 'electron'

export const savePath = () => path.resolve(app.getPath('appData'), app.getName())

export const screenshotsPath = () => path.resolve(savePath(), 'screenshots')
