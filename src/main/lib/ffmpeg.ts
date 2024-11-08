import fs from 'node:fs'
import path from 'node:path'

import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import { screenshotsPath, subtitlesPath } from '@main/constants/app'
import ffmpeg from 'fluent-ffmpeg'
import { nanoid } from 'nanoid'

ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'))
ffmpeg.setFfprobePath(ffprobePath.path.replace('app.asar', 'app.asar.unpacked'))

export default class FFmpeg {
  ffmpeg: ffmpeg.FfmpegCommand

  constructor(inputPath: string) {
    this.ffmpeg = ffmpeg(inputPath)
  }

  grabFrame = (time: string): Promise<string> => {
    const fileName = `${Date.now()}-${nanoid(10)}.jpeg`
    const fullPath = path.join(screenshotsPath(), fileName)
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(screenshotsPath())) {
        fs.mkdirSync(screenshotsPath(), { recursive: true })
      }
      this.ffmpeg
        .screenshots({
          timestamps: [time],
          filename: fileName,
          folder: screenshotsPath(),
          size: '640x360', // 可根据需要调整尺寸
        })
        .on('end', () => {
          try {
            const data = fs.readFileSync(fullPath)
            const base64Image = `data:image/jpeg;base64,${data.toString('base64')}`
            fs.unlinkSync(fullPath)
            resolve(base64Image)
          } catch (error) {
            reject(error)
          }
        })
        .on('error', (err) => {
          reject(err?.message)
        })
    })
  }

  coverToAssSubtitle = (): Promise<string> => {
    const fileName = `${Date.now()}-${nanoid(10)}.ass`
    const outPutPath = path.join(subtitlesPath(), fileName)
    return new Promise((resolve, reject) => {
      this.ffmpeg
        .outputOptions('-c:s ass')
        .save(outPutPath)
        .on('end', () => {
          resolve(outPutPath)
        })
        .on('error', (err) => {
          reject(err)
        })
    })
  }

  extractAndCoverAllSubtitles = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(subtitlesPath())) {
        fs.mkdirSync(subtitlesPath(), { recursive: true })
      }
      ffmpeg.ffprobe(this.ffmpeg._inputs[0].source, (err, metadata) => {
        if (err) {
          return reject(err)
        }
        const subtitleStreams = metadata.streams.filter(
          (stream) => stream.codec_type === 'subtitle',
        )
        if (subtitleStreams.length === 0) {
          return reject(['No subtitles'])
        }

        const promises = subtitleStreams.map((_, index) => {
          const fileName = `${Date.now()}-${nanoid(10)}-${index}.ass`
          const outputPath = path.join(subtitlesPath(), fileName)

          return new Promise<string>((resolve, reject) => {
            this.ffmpeg
              .clone() // Ensure a new instance for each command
              .outputOptions(['-map', `0:s:${index}`, '-c:s', 'ass'])
              .save(outputPath)
              .on('end', () => {
                resolve(outputPath)
              })
              .on('error', (err) => {
                reject(err)
              })
          })
        })

        Promise.all(promises)
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      })
    })
  }
}
