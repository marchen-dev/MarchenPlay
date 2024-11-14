import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import { videoAtom } from '@renderer/atoms/player'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select'
import { db } from '@renderer/database/db'
import { tipcClient } from '@renderer/lib/client'
import NotoSansSC from '@renderer/styles/fonts/NotoSansSC.woff2?url'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import SubtitlesOctopus from 'libass-wasm'
import workerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker.js?url'
import legacyWorkerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url'
import { useCallback } from 'react'

export const Subtitle = () => {
  const { subtitlesData, fetchSubtitleBody } = useSubtitle()

  return (
    <div>
      <Select defaultValue={subtitlesData?.defaultId.toString()} onValueChange={fetchSubtitleBody}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="选中字幕" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>字幕</SelectLabel>
            {subtitlesData?.tags?.map((subtitle) => {
              return (
                <SelectItem value={subtitle.id.toString()} key={subtitle.id}>
                  {subtitle.title}
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export const useSubtitle = () => {
  const { hash, url, player, subtitlesOctopus } = useAtomValue(videoAtom)
  const setVideo = useSetAtom(videoAtom)
  const { data } = useQuery({
    queryKey: ['getAllSubtitlesFromAnime', url],
    queryFn: async () => {
      const subtitleDetails = await tipcClient?.getSubtitlesIntroFromAnime({ path: url })
      const anime = await db.history.get(hash)
      const defaultId =
        anime?.subtitles?.defaultIndex ??
        subtitleDetails?.find(
          (subtitle) => subtitle.tags.language === 'zho' || subtitle.tags.language === 'chi',
        )?.index ??
        subtitleDetails?.[0]?.index

      return {
        tags: subtitleDetails?.map((subtitle, index) => ({
          id: subtitle.index,
          index,
          title: subtitle.tags.title,
          language: subtitle.tags.language,
        })),
        defaultId: defaultId ?? -1,
      }
    },
    enabled: !!url,
  })
  const fetchSubtitleBody = useCallback(
    async (id: string) => {
      if (subtitlesOctopus) {
        subtitlesOctopus.dispose()
      }

      const index = data?.tags?.findIndex((subtitle) => subtitle.id.toString() === id) ?? -1
      if (index === -1) {
        return
      }

      const subtitlePath = await tipcClient?.getSubtitlesBody({
        path: url,
        index,
      })

      if (!subtitlePath) {
        return
      }
      setVideo((prev) => ({
        ...prev,
        subtitlesOctopus: new SubtitlesOctopus({
          fonts: [NotoSansSC],
          fallbackFont: NotoSansSC,
          video: player?.media as HTMLVideoElement,
          subUrl: `${MARCHEN_PROTOCOL_PREFIX}${subtitlePath}`,
          workerUrl,
          legacyWorkerUrl,
        }),
      }))
    },
    [data?.tags, url, player?.media],
  )
  return {
    subtitlesData: data,
    fetchSubtitleBody,
  }
}
