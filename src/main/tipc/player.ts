import { dialog } from 'electron'

import { t } from './_instance'

export const playerRoute = {
  showErrorDialog: t.procedure
    .input<{ title: string; content: string }>()
    .action(async ({ input }) => dialog.showErrorBox(input.title, input.content))
}
