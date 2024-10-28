import fs from 'node:fs'
import path from 'node:path'

import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import { screenshotsPath } from '@main/constants/app'
import ffmpeg from 'fluent-ffmpeg'
import { nanoid } from 'nanoid'

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)

export default class FFmpeg {
  ffmepg: ffmpeg.FfmpegCommand

  constructor(inputPath: string) {
    this.ffmepg = ffmpeg(inputPath)
  }

  grabFrame = (time: string): Promise<string> => {
    const fileName = `${Date.now()}-${nanoid(10)}.jpeg`
    const fullPath = path.join(screenshotsPath(), fileName)
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(screenshotsPath())) {
        fs.mkdirSync(screenshotsPath(), { recursive: true })
      }
      this.ffmepg
        .screenshots({
          timestamps: [time],
          filename: fileName,
          folder: screenshotsPath(),
          size: '640x360', // 可根据需要调整尺寸
        })
        .on('end', () => {
          const data = fs.readFileSync(fullPath)
          const base64Image = `data:image/jpeg;base64,${data.toString('base64')}`
          fs.unlinkSync(fullPath)
          resolve(base64Image)
        })
        .on('error', (err) => {
          reject(err?.message)
        })
    })
  }
}