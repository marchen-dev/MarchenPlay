import { currentMatchedVideoAtom, playerSettingSheetAtom, videoAtom } from '@renderer/atoms/player'
import { jotaiStore } from '@renderer/atoms/store'
import { FieldLayout } from '@renderer/components/modules/settings/views/Layout'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select'
import { useAtomValue } from 'jotai'
import { memo, useMemo } from 'react'

import { showMatchAnimeDialog } from '../../../loading/dialog/hooks'
import { usePlayerInstance } from '../../Context'

export const Rematch = memo(() => {
  const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)
  const video = useAtomValue(videoAtom)
  const player = usePlayerInstance()

  const matchedDanmaku = useMemo(() => {
    if (currentMatchedVideo.animeTitle && currentMatchedVideo.episodeTitle) {
      return `${currentMatchedVideo.animeTitle} - ${currentMatchedVideo?.episodeTitle}`
    }
    return '暂无'
  }, [currentMatchedVideo])
  return (
    <FieldLayout title="弹幕">
      <Select defaultValue={'-1'}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="弹幕库" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={'-1'}>{matchedDanmaku}</SelectItem>
            <SelectLabel
              className="cursor-default select-none transition-colors duration-150 hover:text-primary"
              onClick={() => {
                player?.pause()
                jotaiStore.set(playerSettingSheetAtom, false)
                showMatchAnimeDialog(true, video.hash)
              }}
            >
              重新匹配弹幕库
            </SelectLabel>
          </SelectGroup>
        </SelectContent>
      </Select>
    </FieldLayout>
  )
})
