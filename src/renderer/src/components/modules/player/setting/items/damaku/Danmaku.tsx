import {
  DanmakuSetting,
} from '@renderer/components/modules/settings/views/player/Player'

export const Danmaku = () => {
  return (
    <div>
      <DanmakuSetting classNames={{ cardLayout: 'space-y-3' }} />
    </div>
  )
}
