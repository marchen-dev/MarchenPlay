import { playerSettingSheetAtom, videoAtom } from '@renderer/atoms/player'
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
import { useToast } from '@renderer/components/ui/toast'
import { db } from '@renderer/database/db'
import { tipcClient } from '@renderer/lib/client'
import { isWeb } from '@renderer/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import type { ChangeEvent } from 'react'
import { useEffect, useRef } from 'react'

import { usePlayerInstance } from '../../Context'
import { useSubtitle } from './hooks'

export const Subtitle = () => {
  const player = usePlayerInstance()
  const { subtitlesData, fetchSubtitleBody } = useSubtitle()
  const { toast } = useToast()
  const { hash } = useAtomValue(videoAtom)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { data: defaultValue, isFetching } = useQuery({
    queryKey: ['subtitlesDefaultValue', hash],
    queryFn: async () => {
      const history = await db.history.get(hash)
      return history?.subtitles?.defaultId?.toString() ?? '-1'
    },
    staleTime: 0,
  })

  useEffect(() => {
    if (!isWeb) {
      return
    }
    // 确保不会误触视频暂停事件
    player?.setConfig({ closeVideoClick: true })
    return () => {
      player?.setConfig({ closeVideoClick: false })
    }
  }, [player])

  const importSubtitleFromBrowser = (e: ChangeEvent<HTMLInputElement>) => {
    const changeEvent = e as unknown as ChangeEvent<HTMLInputElement>
    const file = changeEvent.target?.files?.[0]

    if (!file) {
      return
    }
    const url = URL.createObjectURL(file)
    fetchSubtitleBody({ path: url, fileName: file.name })
    toast({
      title: '导入字幕成功',
      duration: 1500,
    })
    jotaiStore.set(playerSettingSheetAtom, false)
  }

  const importSubtitleFromClient = async () => {
    const subtitlePath = await tipcClient?.importSubtitle()
    if (!subtitlePath) {
      return
    }
    fetchSubtitleBody({ path: subtitlePath.filePath, fileName: subtitlePath.fileName })
    toast({
      title: '导入字幕成功',
      duration: 1500,
    })
    jotaiStore.set(playerSettingSheetAtom, false)
  }

  if (!defaultValue || isFetching) {
    return
  }
  return (
    <FieldLayout title="字幕">
      <Select
        defaultValue={defaultValue.toString()}
        onValueChange={(id) => fetchSubtitleBody({ id: +id })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选中字幕" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={'-1'}>默认</SelectItem>
            {subtitlesData?.tags?.map((subtitle) => {
              return (
                <SelectItem value={subtitle.id.toString()} key={subtitle.id}>
                  {subtitle.title}
                </SelectItem>
              )
            })}
            <SelectLabel
              className="cursor-default select-none transition-colors duration-150 hover:text-primary"
              onClick={() => {
                if (isWeb) {
                  return fileInputRef.current?.click()
                }
                importSubtitleFromClient()
              }}
            >
              加载外挂字幕...
            </SelectLabel>
          </SelectGroup>
        </SelectContent>
      </Select>
      {isWeb && (
        <input
          type="file"
          accept=".ass, .ssa, .art, .vtt"
          ref={fileInputRef}
          onChange={importSubtitleFromBrowser}
          className="hidden"
        />
      )}
    </FieldLayout>
  )
}
