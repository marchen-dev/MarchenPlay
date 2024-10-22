import {
  danmakuDurationList,
  danmakuFontSizeList,
} from '@renderer/components/modules/settings/views/player/list'
import type { SelectGroup } from '@renderer/components/modules/settings/views/Select'
import { useAtom, useAtomValue } from 'jotai'

import { createSettingATom } from './helper'

const getSelectedDefaultValue = (list: SelectGroup[]) => {
  return list.find((item) => item.default)?.value
}

const createPlayerDefaultSettings = () => {
  return {
    enableTraditionalToSimplified: false,
    danmakuFontSize: getSelectedDefaultValue(danmakuFontSizeList) ?? '26',
    danmakuDuration: getSelectedDefaultValue(danmakuDurationList) ?? '15000',
  }
}

const atom = createSettingATom('player', createPlayerDefaultSettings)

export const usePlayerSettings = () => useAtom(atom)
export const usePlayerSettingsValue = () => useAtomValue(atom)
