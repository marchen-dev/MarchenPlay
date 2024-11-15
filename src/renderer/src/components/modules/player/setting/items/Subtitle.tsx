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
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtomValue, useSetAtom } from 'jotai'
import SubtitlesOctopus from 'libass-wasm'
import workerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker.js?url'
import legacyWorkerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url'
import { useCallback } from 'react'

export const Subtitle = () => {
  const { subtitlesData, fetchSubtitleBody } = useSubtitle()
  const { hash } = useAtomValue(videoAtom)
  const data = useLiveQuery(() => db.history.get(hash), [hash])

  if (!data) {
    return
  }
  return (
    <div>
      <Select
        defaultValue={data?.subtitles?.defaultId.toString()}
        onValueChange={fetchSubtitleBody}
      >
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
  const { hash, url, player, subtitlesInstance } = useAtomValue(videoAtom)
  const setVideo = useSetAtom(videoAtom)
  const { data } = useQuery({
    queryKey: ['getAllSubtitlesFromAnime', url],
    queryFn: async () => {
      const subtitleDetails = await tipcClient?.getSubtitlesIntroFromAnime({ path: url })
      const anime = await db.history.get(hash)
      const defaultId =
        anime?.subtitles?.defaultId ??
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
    staleTime: 0,
  })
  const fetchSubtitleBody = useCallback(
    async (id: string) => {
      const index = data?.tags?.findIndex((subtitle) => subtitle.id.toString() === id) ?? -1
      if (index === -1) {
        return
      }
      const existingSubtitle = (
        await db.history.where('hash').equals(hash).first()
      )?.subtitles?.tags.find((tag) => tag.id === +id)

      const oldHistory = await db.history.get(hash)

      if (existingSubtitle) {
        db.history.update(hash, {
          subtitles: {
            defaultId: id,
            tags: oldHistory?.subtitles?.tags ?? [],
          },
        })
        return setSubtitlesOctopus(existingSubtitle.path)
      }

      const subtitlePath = await tipcClient?.getSubtitlesBody({
        path: url,
        index,
      })

      if (!subtitlePath || !data?.tags?.[index]) {
        return
      }

      const newTags = [
        ...(oldHistory?.subtitles?.tags ?? []),
        {
          ...data.tags[index],
          path: subtitlePath,
        },
      ]

      db.history.update(hash, {
        subtitles: {
          defaultId: id,
          tags: newTags,
        },
      })

      setSubtitlesOctopus(subtitlePath)
    },
    [data?.tags, url, player?.media, hash],
  )

  const setSubtitlesOctopus = useCallback(
    (path: string) => {
      const completePath = `${MARCHEN_PROTOCOL_PREFIX}${path}`
      if (!subtitlesInstance) {
        return setVideo((prev) => ({
          ...prev,
          subtitlesInstance: new SubtitlesOctopus({
            fonts: [NotoSansSC],
            fallbackFont: NotoSansSC,
            video: player?.media as HTMLVideoElement,
            subUrl: completePath,
            workerUrl,
            legacyWorkerUrl,
          }),
        }))
      }
      subtitlesInstance.freeTrack()
      subtitlesInstance.setTrackByUrl(completePath)
    },
    [player?.media, setVideo, subtitlesInstance],
  )

  const initializeSubtitle = useCallback(() => {
    if (data?.defaultId !== undefined && data?.defaultId !== -1) {
      fetchSubtitleBody(data.defaultId.toString())
    }
  }, [data?.defaultId, fetchSubtitleBody])

  return {
    subtitlesData: data,
    fetchSubtitleBody,
    setSubtitlesOctopus,
    initializeSubtitle,
    subtitlesInstance,
  }
}
