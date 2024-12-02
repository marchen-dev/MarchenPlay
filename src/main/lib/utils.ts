import { getRendererHandlers } from '@main/windows/setting'
import logger from 'electron-log'

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const parseReleaseNotes = (releaseNotes: string | unknown[] | null | undefined) => {
  let releaseContent = ''

  if (releaseNotes) {
    if (typeof releaseNotes === 'string') {
      releaseContent = releaseNotes
    } else if (Array.isArray(releaseNotes)) {
      releaseNotes.forEach((releaseNote) => {
        releaseContent += `${releaseNote}\n`
      })
    }
  } else {
    releaseContent = '暂无更新说明'
  }

  return releaseContent
}

export const isVideoFile = (filePath: string) => {
  const videoExtensions = ['mp4', 'mkv']
  const ext = filePath.split('.').pop()
  return videoExtensions.includes(ext!)
}

// 通过视频文件快捷打开
export function quickLaunchViaVideo() {
  const { argv } = process
  const filePath = argv.at(-1)
  if (!filePath) {
    return
  }
  if (isVideoFile(filePath)) {
    logger.info('[app] windows open File', filePath)
    getRendererHandlers()?.importAnime.send({ path: filePath })
  }
}
