import type { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      showFilePath: (file: File) => string
    }
    platform: string
  }
}
