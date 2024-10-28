import fs from 'node:fs'
import path from 'node:path'

import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import FFmpeg from '@main/lib/ffmpeg'
import { calculateFileHashByBuffer } from '@renderer/lib/calc-file-hash'
import { dialog } from 'electron'

import { t } from './_instance'

export const playerRoute = {
  showErrorDialog: t.procedure
    .input<{ title: string; content: string }>()
    .action(async ({ input }) => dialog.showErrorBox(input.title, input.content)),
  getAnimeDetailByPath: t.procedure.input<{ path: string }>().action(async ({ input }) => {
    const animePath = input?.path.replace(MARCHEN_PROTOCOL_PREFIX, '')
    if (!animePath || !fs.existsSync(animePath)) {
      return {
        ok: 0,
        message: '视频文件可能移动或者损坏，无法继续播放',
      }
    }

    try {
      const stats = fs.statSync(animePath)
      const fileName = path.basename(animePath)
      const fileSize = stats.size

      const bufferSize = Math.min(fileSize, 16 * 1024 * 1024)
      const buffer = Buffer.alloc(bufferSize)
      const fd = fs.openSync(animePath, 'r')
      fs.readSync(fd, buffer, 0, bufferSize, 0)
      fs.closeSync(fd)

      const fileHash = await calculateFileHashByBuffer(buffer)
      return { ok: 1, fileSize, fileName, fileHash }
    } catch {
      return {
        ok: 0,
        message: '获取视频信息失败',
      }
    }
  }),
  grabFrame: t.procedure.input<{ path: string; time: string }>().action(async ({ input }) => {
    const ffmpeg = new FFmpeg(input.path)
    const base64Image = (await ffmpeg.grabFrame(input.time)) as string
    return base64Image
  }),
  importAnime: t.procedure.action(async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: '视频文件', extensions: ['mp4', 'mkv'] }],
    })
    if (result.canceled) {
      return
    }
    return result.filePaths[0]
  }),
}
