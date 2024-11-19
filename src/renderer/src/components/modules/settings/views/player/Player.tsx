import { usePlayerSettings } from '@renderer/atoms/settings/player'
import type { FC } from 'react'
import { useMemo } from 'react'

import { FieldLayout, FieldsCardLayout, SettingViewContainer } from '../Layout'
import { SettingSelect } from '../Select'
import { SettingSwitch } from '../Switch'
import { danmakuDurationList, danmakuEndAreaList, danmakuFontSizeList } from './list'

export const PlayerView = () => {
  return (
    <SettingViewContainer>
      <DanmakuSetting />
    </SettingViewContainer>
  )
}

export const DanmakuSetting: FC<{ classNames?: { cardLayout?: string } }> = ({ classNames }) => {
  const [playerSetting, setPlayerSetting] = usePlayerSettings()
  const CardLayout = useMemo(() => {
    return ({ children }) =>
      classNames?.cardLayout ? (
        <div className={classNames?.cardLayout}>{children}</div>
      ) : (
        <FieldsCardLayout title="弹幕">{children}</FieldsCardLayout>
      )
  }, [classNames])

  return (
    <CardLayout>
      <FieldLayout title="繁体转简体">
        <SettingSwitch
          value={playerSetting.enableTraditionalToSimplified}
          onCheckedChange={(value) =>
            setPlayerSetting((prev) => ({ ...prev, enableTraditionalToSimplified: value }))
          }
        />
      </FieldLayout>
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
      <FieldLayout title="显示区域">
        <SettingSelect
          placeholder="弹幕显示区域"
          groups={danmakuEndAreaList}
          value={playerSetting.danmakuEndArea}
          onValueChange={(value) =>
            setPlayerSetting((prev) => ({ ...prev, danmakuEndArea: value }))
          }
        />
      </FieldLayout>
    </CardLayout>
  )
}
