import { useAppSettingsValue } from './app'
import { usePlayerSettingsValue } from './player'

export const useSettingsValue = () => {
  return {
    app: useAppSettingsValue(),
    player: usePlayerSettingsValue(),
  }
}
