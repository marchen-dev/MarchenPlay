import { useAtom } from 'jotai'

import { createSettingATom } from './helper'

const createPlayerDefaultSettings = () => {
  return {
    danmakuFontSize: 24,
    danmakuDuration: 10,
  }
}

const atom = createSettingATom('player', createPlayerDefaultSettings)

export const usePlayerSettings = () => useAtom(atom)
