import { DanmakuSetting } from '@renderer/components/modules/settings/views/player/Player'
import { memo } from 'react'

import { Rematch } from './Rematch'

export const Danmaku = memo(() => {
  // const player = usePlayerInstance()
  // const { parseDanmakuData, setResponsiveDanmakuConfig } = useXgPlayerUtils()
  // const { toast } = useToast()
  // const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)
  // const { danmakuDuration } = usePlayerSettingsValue()
  // const handleDanmakuLanguageChange = async (covert: boolean) => {
  //   if (!player) {
  //     return
  //   }
  //   const covertedDanmaku = await apiClient.comment.getDanmu(+currentMatchedVideo.episodeId, {
  //     chConvert: covert ? 1 : 0,
  //   })
  //   const danmaku = parseDanmakuData({
  //     danmuData: covertedDanmaku,
  //     duration: +danmakuDuration,
  //   })
  //   player.danmu?.clear()

  //   player.danmu?.updateComments(danmaku, true)
  //   setResponsiveDanmakuConfig(player)

  //   toast({
  //     title: `弹幕${covert ? '开启' : '关闭'}繁体转简体`,
  //   })
  // }

  return (
    <>
      <DanmakuSetting
        classNames={{ cardLayout: 'space-y-3' }}
        // onTraditionalToSimplifiedChange={(covert) => {
          // handleDanmakuLanguageChange(covert)
        // }}
      >
        <Rematch />
      </DanmakuSetting>
    </>
  )
})
