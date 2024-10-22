import { useAtom, useAtomValue } from 'jotai'

import { createSettingATom } from './helper'

const createPlayerDefaultSettings = () => {
  return {
    danmakuFontSize: '25',
    danmakuDuration: '15000',
  }
}

const atom = createSettingATom('player', createPlayerDefaultSettings)

export const usePlayerSettings = () => useAtom(atom)
export const usePlayerSettingsValue = () => useAtomValue(atom)
