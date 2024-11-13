import fs from 'node:fs'
import path from 'node:path'

import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import FFmpeg from '@main/lib/ffmpeg'
import { getFilePathFromProtocolURL } from '@main/lib/protocols'
import { showFileSelectionDialog } from '@main/modules/showDialog'
import { calculateFileHashByBuffer } from '@renderer/lib/calc-file-hash'
import { dialog } from 'electron'

import { t } from './_instance'

export const playerRoute = {
  showWarningDialog: t.procedure
    .input<{ title: string; content: string }>()
    .action(async ({ input }) =>
      dialog.showMessageBoxSync({
        message: input.title,
        detail: input.content,
        type: 'warning',
      }),
    ),
  getAnimeDetailByPath: t.procedure.input<{ path: string }>().action(async ({ input }) => {
    const animePath = input?.path.replace(MARCHEN_PROTOCOL_PREFIX, '')
    if (!animePath || !fs.existsSync(animePath)) {
      return {
        ok: 0,
        message: '视频文件可能被移动，无法继续播放',
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
  importSubtitle: t.procedure.action(async () => {
    const filePath = await showFileSelectionDialog({
      filters: [{ name: '字幕文件', extensions: ['srt', 'ass', 'ssa', 'vtt'] }],
    })
    if (!filePath) {
      return
    }
    const extName = path.extname(filePath)
    if (!extName) {
      return
    }
    if (extName === 'ass' || extName === 'ssa') {
      return filePath
    }

    const ffmepg = new FFmpeg(filePath)
    const outPutPath = ffmepg.coverToAssSubtitle()

    return outPutPath
  }),
  extractSubtitlesFromAnime: t.procedure.input<{ path: string }>().action(async ({ input }) => {
    const ffmpeg = new FFmpeg(getFilePathFromProtocolURL(input.path))
    const subtitles = await ffmpeg.extractAndCoverAllSubtitles()
    return subtitles
  }),
}
