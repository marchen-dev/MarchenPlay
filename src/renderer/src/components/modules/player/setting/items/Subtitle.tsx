import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import { playerSettingSheetAtom, videoAtom } from '@renderer/atoms/player'
import { jotaiStore } from '@renderer/atoms/store'
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
import SourceHanSansCN from '@renderer/styles/fonts/SourceHanSansCN.woff2?url'
import TimesNewRoman from '@renderer/styles/fonts/TimesNewRoman.ttf?url'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import SubtitlesOctopus from 'libass-wasm'
import workerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker.js?url'
import legacyWorkerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url'
import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { usePlayerInstance, useSubtitleInstance } from '../Context'

export const Subtitle = () => {
  const selectRef = useRef<HTMLDivElement | null>(null)
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
    <div ref={selectRef} className="p-1">
      <Select
        defaultValue={defaultValue.toString()}
        onValueChange={(id) => fetchSubtitleBody({ id: +id })}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="选中字幕" />
        </SelectTrigger>
        <SelectContent container={selectRef.current}>
          <SelectGroup>
            <SelectItem value={'-1'}>禁用</SelectItem>
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
    </div>
  )
}

export const useSubtitle = () => {
  const { hash, url } = useAtomValue(videoAtom)
  const player = usePlayerInstance()
  const [subtitlesInstance, setSubtitlesInstance] = useSubtitleInstance()
  const setVideo = useSetAtom(videoAtom)
  const { data, isFetching } = useQuery({
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

      // 合并内嵌字幕列表和手动导入字幕列表
      const tags = [
        ...(subtitleDetails?.map((subtitle, index) => ({
          id: subtitle.index,
          index,
          title: subtitle.tags.title,
          language: subtitle.tags.language,
        })) ?? []),
        ...(anime?.subtitles?.tags.filter((tag) => tag.id < -1) ?? []),
      ]
      return {
        tags,
        defaultId: defaultId ?? -1,
      }
    },
    enabled: !!url,
    staleTime: 0,
  })
  const setSubtitlesOctopus = useCallback(
    (path: string) => {
      if (!player) {
        return
      }
      const completePath = isWeb ? path : `${MARCHEN_PROTOCOL_PREFIX}${path}`
      if (!subtitlesInstance) {
        setSubtitlesInstance(
          new SubtitlesOctopus({
            fonts: [TimesNewRoman],
            fallbackFont: SourceHanSansCN,
            video: player?.media as HTMLVideoElement,
            subUrl: completePath,
            workerUrl,
            legacyWorkerUrl,
          }),
        )
        return
      }
      subtitlesInstance?.freeTrack()
      subtitlesInstance?.setTrackByUrl(completePath)
    },
    [player?.media, setVideo, subtitlesInstance],
  )

  const fetchSubtitleBody = useCallback(
    async (params: FetchSubtitleBodyParams) => {
      const { id, path } = params
      const oldHistory = await db.history.get(hash)

      // 手动导入字幕
      if (path || id === undefined) {
        let minimumId = oldHistory?.subtitles?.tags.slice().sort((tag1, tag2) => {
          return tag1.id - tag2.id
        })[0].id
        if (minimumId === undefined || minimumId >= -1) {
          minimumId = -1
        }

        db.history.update(hash, {
          subtitles: {
            defaultId: minimumId - 1,
            tags: [
              ...(oldHistory?.subtitles?.tags ?? []),
              { id: minimumId - 1, path, title: `手动字幕 - ${Math.abs(minimumId)}` },
            ],
          },
        })

        return setSubtitlesOctopus(path)
      }

      const index = data?.tags?.findIndex((subtitle) => subtitle.id === id) ?? -1

      // 禁用字幕
      if (index === -1) {
        subtitlesInstance?.freeTrack()
        db.history.update(hash, {
          subtitles: {
            defaultId: id,
            tags: oldHistory?.subtitles?.tags ?? [],
          },
        })
        return
      }
      const existingSubtitle = (
        await db.history.where('hash').equals(hash).first()
      )?.subtitles?.tags.find((tag) => tag.id === id)

      // indexdb 已经存在字幕路径
      if (existingSubtitle) {
        db.history.update(hash, {
          subtitles: {
            defaultId: id,
            tags: oldHistory?.subtitles?.tags ?? [],
          },
        })
        return setSubtitlesOctopus(existingSubtitle.path)
      }

      // 通过 ipc 获取被选中的动漫内嵌字幕
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
    [data?.tags, url, hash, setSubtitlesOctopus],
  )

  const initializeSubtitle = useCallback(() => {
    if (data?.defaultId !== undefined && data?.defaultId !== -1) {
      fetchSubtitleBody({ id: data.defaultId })
    }
  }, [data?.defaultId, fetchSubtitleBody])

  return {
    subtitlesData: data,
    fetchSubtitleBody,
    setSubtitlesOctopus,
    initializeSubtitle,
    subtitlesInstance,
    isFetching
  }
}

type FetchSubtitleBodyParams = ParamsWithId | ParamsWithPath

type ParamsWithId = {
  id: number
  path?: undefined
  fileName?: undefined
}

type ParamsWithPath = {
  id?: undefined
  path: string
  fileName: string
}
