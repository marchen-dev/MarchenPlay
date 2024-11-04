import { dialog } from 'electron'

export const showFileSelectionDialog = async (params: { filters: Electron.FileFilter[] }) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: params.filters,
  })
  if (result.canceled) {
    return
  }
  return result.filePaths[0]
}
