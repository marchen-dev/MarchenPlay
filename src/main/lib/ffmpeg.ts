import path from 'node:path'

import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)

export default class Ffmpeg {
  ffmpeg: ffmpeg.FfmpegCommand
  constructor(inputPath: string) {
    this.ffmpeg = ffmpeg(inputPath)
  }

  progressEvent() {
    
  }

  run() {
    this.ffmpeg
      .videoCodec('libx264')
      .size('320x240')
      .on('error', () => {
        
      })
      .on('progress', this.progressEvent.bind(this))
      .on('end', () => {
        
      })
      .save(path.resolve(__dirname, 'output.mp4'))
  }
}
