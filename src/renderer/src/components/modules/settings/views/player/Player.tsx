import { usePlayerSettings } from '@renderer/atoms/settings/player'

import { FieldLayout, FieldsCardLayout, SettingViewContainer } from '../Layout'
import { SettingSelect } from '../SettingSelect'
import { danmakuFontSizeList } from './list'

export const PlayerView = () => {
  const [playerSetting, setPlayerSetting] = usePlayerSettings()
  return (
    <SettingViewContainer>
      <FieldsCardLayout title="播放" />
      <FieldsCardLayout title="弹幕 ">
        <FieldLayout title="字体大小">
          <SettingSelect
            placeholder="弹幕字体大小"
            groups={danmakuFontSizeList}
            value={`${playerSetting.danmakuFontSize}`}
            onValueChange={(value) =>
              setPlayerSetting((prev) => ({ ...prev, danmakuFontSize: Number.parseInt(value) }))
            }
          />
        </FieldLayout>
        <FieldLayout title="持续时间" />
      </FieldsCardLayout>
    </SettingViewContainer>
  )
}
