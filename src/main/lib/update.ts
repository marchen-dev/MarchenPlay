import { dialog } from 'electron'
import logger from 'electron-log'
import type { AppUpdater as _AppUpdater, UpdateInfo } from 'electron-updater'
import electronUpdater from 'electron-updater'

const { autoUpdater } = electronUpdater
export class Update {
  private readonly _update: _AppUpdater

  constructor() {
    logger.transports.file.level = 'debug'
    autoUpdater.logger = logger
    autoUpdater.forceDevUpdateConfig = true
    autoUpdater.autoDownload = true

    this._update = autoUpdater

  }
  autoUpdate() {
    // 检测下载错误
    autoUpdater.on('error', (error) => {
      logger.error('更新异常', error)
    })

    autoUpdater.on('update-available', (releaseInfo: UpdateInfo) => {
      autoUpdater.logger?.info('检测到新版本，确认是否下载')
      const { releaseNotes } = releaseInfo
      let releaseContent = ''
      if (releaseNotes) {
        if (typeof releaseNotes === 'string') {
          releaseContent = releaseNotes as string
        } else if (Array.isArray(releaseNotes)) {
          releaseNotes.forEach((releaseNote) => {
            releaseContent += `${releaseNote}\n`
          })
        }
      } else {
        releaseContent = '暂无更新说明'
      }

      // 弹框确认是否下载更新（releaseContent是更新日志）
      dialog
        .showMessageBox({
          type: 'info',
          title: '应用有新的更新',
          detail: releaseContent,
          message: '发现新版本，是否现在更新？',
          buttons: ['下次再说', '更新'],
        })
        .then(({ response }) => {
          if (response === 1) {
            logger.info('用户选择更新，准备下载更新')
            autoUpdater.downloadUpdate()
          }
        })
    })

    // 更新下载进度
    autoUpdater.on('download-progress', (progress) => {
      logger.info('下载进度', progress)
    })

    // 当需要更新的内容下载完成后
    autoUpdater.on('update-downloaded', () => {
      logger.info('下载完成，准备更新')
      dialog
        .showMessageBox({
          title: '安装更新',
          message: '更新下载完毕，应用将重启并进行安装',
        })
        .then(() => {
          setImmediate(() => autoUpdater.quitAndInstall())
        })
    })
  }
  get instance() {
    return this._update
  }
}
const appUpdater = new Update()

export { appUpdater }
