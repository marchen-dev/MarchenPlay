import { getStorageNS } from '@renderer/lib/ns'
import { atomWithStorage } from 'jotai/utils'

export const createSettingATom = <T extends object>(
  settingKey: string,
  createDefaultSettings: () => T,
) => {
  return atomWithStorage(getStorageNS(settingKey), createDefaultSettings(), undefined, {
    getOnInit: true,
  })
}
