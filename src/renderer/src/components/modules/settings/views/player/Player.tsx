import { usePlayerSettings } from '@renderer/atoms/settings/player'

import { FieldLayout, FieldsCardLayout, SettingViewContainer } from '../Layout'
import { SettingSelect } from '../SettingSelect'
import { danmakuDurationList, danmakuFontSizeList } from './list'

export const PlayerView = () => {
  const [playerSetting, setPlayerSetting] = usePlayerSettings()
  return (
    <SettingViewContainer>
      <FieldsCardLayout title="弹幕 ">
        <FieldLayout title="字体大小">
          <SettingSelect
            placeholder="弹幕字体大小"
            groups={danmakuFontSizeList}
            value={playerSetting.danmakuFontSize}
            onValueChange={(value) =>
              setPlayerSetting((prev) => ({ ...prev, danmakuFontSize: value }))
            }
          />
        </FieldLayout>
        <FieldLayout title="持续时间">
          <SettingSelect
            placeholder="弹幕持续时间"
            groups={danmakuDurationList}
            value={playerSetting.danmakuDuration}
            onValueChange={(value) =>
              setPlayerSetting((prev) => ({ ...prev, danmakuDuration: value }))
            }
          />
        </FieldLayout>
      </FieldsCardLayout>
    </SettingViewContainer>
  )
}
