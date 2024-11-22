/* eslint-disable no-console */
import { exec } from 'node:child_process'
import os from 'node:os'

const platform = os.platform()

if (platform === 'darwin') {
  console.log('Detected macOS, installing darwin dependencies...')
  // 为了在 macos arm64 架构下进行打包 x64 架构的 APP, 所以需要同时安装 x64 arm64 架构的 ffmpeg 和 ffprobe
  exec(
    'pnpm i @ffmpeg-installer/darwin-x64@^4.1.0 @ffprobe-installer/darwin-x64@^5.1.0 @ffmpeg-installer/darwin-arm64@^4.1.5 @ffprobe-installer/darwin-arm64@^5.0.1 -D',
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error installing optional dependencies: ${stderr}`)
        throw new Error('Error installing optional dependencies')
      } else {
        console.log(`Optional dependencies installed: ${stdout}`)
      }
    },
  )
} else {
  console.log('Non-macOS platform detected, skipping optional dependencies installation.')
}
