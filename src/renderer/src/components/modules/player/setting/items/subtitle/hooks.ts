import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import { videoAtom } from '@renderer/atoms/player'
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
import { useCallback } from 'react'

import { usePlayerInstance, useSubtitleInstance } from '../../../Context'

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
          title: subtitle.tags.title || `未知字幕 - ${index}`,
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
    gcTime: 0,
  })
  const setSubtitlesOctopus = useCallback(
    async (path?: string) => {
      if (!player || !path) {
        return
      }
      const completePath = isWeb ? path : `${MARCHEN_PROTOCOL_PREFIX}${path}`
      const history = await db.history.get(hash)
      if (!subtitlesInstance) {
        setSubtitlesInstance(
          new SubtitlesOctopus({
            fonts: [TimesNewRoman],
            fallbackFont: SourceHanSansCN,
            video: player?.media as HTMLVideoElement,
            subUrl: completePath,
            timeOffset: history?.subtitles?.timeOffset ?? 0,
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

      // Web 端直接设置字幕路径, 不进行 indexdb 记录
      if (isWeb) {
        return setSubtitlesOctopus(path)
      }

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
            timeOffset: oldHistory?.subtitles?.timeOffset ?? 0,
            defaultId: minimumId - 1,
            tags: [
              ...(oldHistory?.subtitles?.tags ?? []),
              { id: minimumId - 1, path, title: `外部字幕 - ${Math.abs(minimumId)}` },
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
            timeOffset: oldHistory?.subtitles?.timeOffset ?? 0,
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
    isFetching,
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
