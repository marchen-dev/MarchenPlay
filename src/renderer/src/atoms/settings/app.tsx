import { useAtom, useAtomValue } from 'jotai'

import { createSettingATom } from './helper'

const createAppDefaultSettings = () => {
  return {
    showPoster: false,
  }
}

const atom = createSettingATom('app', createAppDefaultSettings)

export const useAppSettings = () => useAtom(atom)
export const useAppSettingsValue = () => useAtomValue(atom)
