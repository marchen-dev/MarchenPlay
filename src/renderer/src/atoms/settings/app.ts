import { useAtom, useAtomValue } from 'jotai'

import { createSettingATom } from './helper'

const createAppDefaultSettings = () => {
  return {
    showPoster: false,
    showUpdateNote: false,
  }
}

export const appSettingAtom = createSettingATom('app', createAppDefaultSettings)

export const useAppSettings = () => useAtom(appSettingAtom)
export const useAppSettingsValue = () => useAtomValue(appSettingAtom)
