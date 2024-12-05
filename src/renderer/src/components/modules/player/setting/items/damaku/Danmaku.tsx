import { currentMatchedVideoAtom } from '@renderer/atoms/player'
import { usePlayerSettingsValue } from '@renderer/atoms/settings/player'
import { DanmakuSetting } from '@renderer/components/modules/settings/views/player/Player'
import { useToast } from '@renderer/components/ui/toast'
import { apiClient } from '@renderer/request'
import { useAtomValue } from 'jotai'
import { memo } from 'react'

import { useXgPlayerUtils } from '../../../hooks'
import { usePlayerInstance } from '../../Context'
import { Rematch } from './Rematch'

export const Danmaku = memo(() => {
  const player = usePlayerInstance()
  const { parseDanmakuData, setResponsiveDanmakuConfig } = useXgPlayerUtils()
  const { toast } = useToast()
  const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)
  const { danmakuDuration } = usePlayerSettingsValue()
  const handleDanmakuLanguageChange = async (covert: boolean) => {
    if (!player) {
      return
    }
    const covertedDanmaku = await apiClient.comment.getDanmu(+currentMatchedVideo.episodeId, {
      chConvert: covert ? 1 : 0,
    })
    const danmaku = parseDanmakuData({
      danmuData: covertedDanmaku,
      duration: +danmakuDuration,
    })
    player.danmu?.clear()

    player.danmu?.updateComments(danmaku, true)
    setResponsiveDanmakuConfig(player)

    toast({
      title: `弹幕${covert ? '开启' : '关闭'}繁体转简体`,
    })
  }

  return (
    <>
      <DanmakuSetting
        classNames={{ cardLayout: 'space-y-3' }}
        onTraditionalToSimplifiedChange={(covert) => {
          handleDanmakuLanguageChange(covert)
        }}
      >
        <Rematch />
      </DanmakuSetting>
    </>
  )
})
