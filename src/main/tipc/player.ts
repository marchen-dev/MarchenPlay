import fs from 'node:fs'

import { dialog } from 'electron'

import { t } from './_instance'

export const playerRoute = {
  showErrorDialog: t.procedure
    .input<{ title: string; content: string }>()
    .action(async ({ input }) => dialog.showErrorBox(input.title, input.content)),
  createVideoURL: t.procedure.input<{ path: string }>().action(async ({ input }) => {
    return fs.readFileSync(input.path)
  }),
}
