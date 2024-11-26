import type { MatchedVideoType } from '@renderer/atoms/player'
import { useAppSettings, useAppSettingsValue } from '@renderer/atoms/settings/app'
import { RouterLayout } from '@renderer/components/layout/root/RouterLayout'
import {
  showMatchAnimeDialog,
  showMatchAnimeDialogAtom,
} from '@renderer/components/modules/player/loading/dialog/hooks'
import { MatchAnimeDialog } from '@renderer/components/modules/player/loading/dialog/MatchAnimeDialog'
import { saveToHistory } from '@renderer/components/modules/player/loading/hooks'
import { Badge } from '@renderer/components/ui/badge'
import { FunctionAreaButton, FunctionAreaToggle } from '@renderer/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@renderer/components/ui/menu'
import { ScrollArea } from '@renderer/components/ui/scrollArea'
import { useToast } from '@renderer/components/ui/toast'
import { db } from '@renderer/database/db'
import type { DB_History } from '@renderer/database/schemas/history'
import { useDialog } from '@renderer/hooks/use-dialog'
import { relativeTimeToNow } from '@renderer/lib/date'
import { cn, isWeb } from '@renderer/lib/utils'
import { apiClient } from '@renderer/request'
import { RouteName } from '@renderer/router'
import { useQueryClient } from '@tanstack/react-query'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { memo, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const historyData = useLiveQuery(() => db.history.orderBy('updatedAt').reverse().toArray())
  const appSettings = useAppSettingsValue()
  const showPoster = appSettings.showPoster || isWeb
  return (
    <RouterLayout FunctionArea={<FunctionArea />}>
      <ScrollArea className="h-full px-8">
        {historyData?.length !== 0 ? (
          <ul
            className={cn(
              'grid gap-2 gap-y-3',
              showPoster
                ? 'grid-auto-cols'
                : 'grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5',
            )}
          >
            {historyData?.map((item) => (
              <HistoryItem {...item} showPoster={showPoster || isWeb} key={item.hash} />
            ))}
          </ul>
        ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
            <i className="icon-[mingcute--file-more-line] text-6xl " />
            <p className="text-xl">没有内容</p>
          </div>
        )}
      </ScrollArea>
      <Dialog />
    </RouterLayout>
  )
}

interface HistoryItemProps extends DB_History {
  showPoster: boolean
}

const HistoryItem: FC<HistoryItemProps> = memo((props) => {
  const {
    cover,
    animeTitle,
    episodeTitle,
    progress,
    duration,
    episodeId,
    thumbnail,
    showPoster,
    updatedAt,
    hash,
  } = props
  const navigation = useNavigate()
  const { toast } = useToast()

  const percentage = useMemo(() => {
    const percentage = progress / duration
    return Number.isFinite(percentage) && !Number.isNaN(percentage)
      ? Math.round(percentage * 100)
      : 0
  }, [progress, duration])

  const playAnime = () => {
    if (isWeb) {
      return toast({
        title: '请使用客户端播放',
        description: 'WEB 版本暂时不支持续播功能',
        duration: 5000,
      })
    }
    return navigation(RouteName.PLAYER, { state: { episodeId, hash } })
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <li
          className={cn(
            'flex size-full cursor-default select-none flex-col items-center',
            !isWeb && 'group',
          )}
          onClick={playAnime}
        >
          <div
            className={cn(
              'relative aspect-video size-full overflow-hidden rounded-md ',
              showPoster && 'aspect-auto h-72',
            )}
          >
            <HistoryImage src={showPoster ? cover : (thumbnail ?? cover)} />
            {!isWeb && (
              <i
                className={cn(
                  'icon-[mingcute--play-circle-line]',
                  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-100',
                  'size-16 text-zinc-100 opacity-0 shadow-md group-hover:opacity-100',
                )}
              />
            )}
            <div
              className={cn('absolute bottom-0 left-0 h-1 rounded-md bg-warning')}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-1 w-full px-0.5">
            <p className="truncate text-sm" title={animeTitle}>
              {animeTitle}
            </p>
            <div
              className="flex items-center justify-between text-xs text-zinc-500"
              title={episodeTitle}
            >
              <span className="truncate">{episodeTitle || '暂无弹幕库'}</span>
              <div className="shrink-0 ">
                <Badge variant={'outline'}>{relativeTimeToNow(updatedAt)}</Badge>
              </div>
            </div>
          </div>
        </li>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={playAnime}>继续观看</ContextMenuItem>
        <ContextMenuItem onClick={() => showMatchAnimeDialog(true, hash)}>
          重新匹配弹幕库
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="!text-secondary" onClick={() => db.history.delete(hash)}>
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
})

const FunctionArea = memo(() => {
  const [appSettings, setAppSettings] = useAppSettings()
  const present = useDialog()

  return (
    <div className="no-drag-region flex items-center space-x-2 text-2xl text-zinc-500 ">
      {!isWeb && (
        <FunctionAreaToggle
          pressed={appSettings.showPoster}
          onPressedChange={(value) =>
            setAppSettings((old) => ({
              ...old,
              showPoster: value,
            }))
          }
        >
          <i className="icon-[mingcute--pic-line]" />
        </FunctionAreaToggle>
      )}
      <FunctionAreaButton
        onClick={() =>
          present({
            title: '是否删除历史记录?',
            handleConfirm: () => {
              db.history.clear()
            },
          })
        }
      >
        <i className="icon-[mingcute--delete-2-line]" />
      </FunctionAreaButton>
    </div>
  )
})

interface HistoryImageProps {
  src?: string
}

const HistoryImage: FC<HistoryImageProps> = (props) => {
  const { src } = props
  const [imgError, setImgError] = useState(false)
  return (
    <div className=" size-full border ">
      {!src || imgError ? (
        <div className="flex size-full items-center justify-center bg-gray-200 text-zinc-500 dark:bg-zinc-300">
          <span className="icon-[mingcute--pic-line] size-10 group-hover:hidden" />
        </div>
      ) : (
        <img
          src={src}
          className={cn(
            'pointer-events-none size-full object-cover transition-all duration-100 group-hover:opacity-85 ',
          )}
          onError={() => {
            setImgError(true)
          }}
        />
      )}
    </div>
  )
}
const Dialog = () => {
  const { hash } = useAtomValue(showMatchAnimeDialogAtom)
  const queryClient = useQueryClient()

  const handleUpdateHistory = async (params?: MatchedVideoType) => {
    const old = await db.history.get({ hash })
    if (!old || !hash) {
      return
    }

    const { duration, path, progress, subtitles } = old
    if (!params) {
      return
    }
    const { episodeId, episodeTitle, animeId, animeTitle } = params
    saveToHistory({
      duration,
      path,
      progress,
      subtitles,
      hash,
      ...params,
    })

    // 如果之前之前播放过动漫，就更新匹配数据
    queryClient.setQueryData([apiClient.match.Matchkeys.postVideoEpisodeId, path], {
      isMatched: true,
      matches: [{ episodeTitle, episodeId, animeId, animeTitle }],
    })
  }
  return <MatchAnimeDialog onSelected={handleUpdateHistory} />
}
