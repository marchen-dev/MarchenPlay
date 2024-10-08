import { dialog } from 'electron'

import Ffmpeg from '../lib/ffmpeg'
import { t } from './_instance'

export const playerRoute = {
  showErrorDialog: t.procedure
    .input<{ title: string; content: string }>()
    .action(async ({ input }) => dialog.showErrorBox(input.title, input.content)),
  CompressedVideo: t.procedure.input<{ inputPath: string }>().action(async ({ input }) => {
    const ffmpeg = new Ffmpeg(input.inputPath)
    ffmpeg.run()
  }),
}
