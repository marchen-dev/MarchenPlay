import { useAppSettings, useAppSettingsValue } from '@renderer/atoms/settings/app'
import { RouterLayout } from '@renderer/components/layout/RouterLayout'
import { Badge } from '@renderer/components/ui/badge'
import { ScrollArea } from '@renderer/components/ui/scrollArea'
import { useToast } from '@renderer/components/ui/toast'
import { Toggle } from '@renderer/components/ui/toggle'
import { db } from '@renderer/database/db'
import type { DB_History } from '@renderer/database/schemas/history'
import { cn, isWeb } from '@renderer/lib/utils'
import { RouteName } from '@renderer/router'
import { useLiveQuery } from 'dexie-react-hooks'
import type { FC } from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const historyData = useLiveQuery(() => db.history.orderBy('updatedAt').reverse().toArray())
  const { showPoster } = useAppSettingsValue()
  return (
    <RouterLayout FunctionArea={<FunctionArea />}>
      <ScrollArea className="h-full px-8">
        {historyData?.length !== 0 ? (
          <ul className="grid-auto-cols grid gap-2">
            {historyData?.map((item) => (
              <HistoryItem {...item} showPoster={showPoster} key={item.episodeId} />
            ))}
          </ul>
        ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
            <i className="icon-[mingcute--folder-info-line] text-6xl " />
            <p className="text-xl">没有内容</p>
          </div>
        )}
      </ScrollArea>
    </RouterLayout>
  )
}

const HistoryItem: FC<DB_History & { showPoster: boolean }> = (props) => {
  const { cover, animeTitle, episodeTitle, progress, duration, episodeId, thumbnail, showPoster } =
    props
  const navigation = useNavigate()
  const { toast } = useToast()
  const percentage = useMemo(() => {
    const percentage = progress / duration
    return Number.isFinite(percentage) && !Number.isNaN(percentage)
      ? Math.round(percentage * 100)
      : 0
  }, [progress, duration])
  return (
    <li
      className={cn(' flex cursor-default select-none flex-col items-center', !isWeb && 'group')}
      onClick={() => {
        if (isWeb) {
          return toast({
            title: '请使用客户端播放',
            description: 'WEB 版本暂时不支持续播功能',
            duration: 5000,
          })
        }
        return navigation(RouteName.PLAYER, { state: { episodeId } })
      }}
    >
      <div className="relative h-72 w-full overflow-hidden rounded-md ">
        <img
          src={showPoster ? cover : (thumbnail ?? cover)}
          className="pointer-events-none size-full object-cover transition-all duration-100 group-hover:opacity-85"
        />
        {!isWeb && (
          <i
            className={cn(
              'icon-[mingcute--play-circle-line]',
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-100',
              'size-16 text-white opacity-0 shadow-md group-hover:opacity-100',
            )}
          />
        )}
      </div>
      <div className="mt-1 w-full px-0.5">
        <p className="truncate text-sm" title={animeTitle}>
          {animeTitle}
        </p>
        <div
          className="flex items-center justify-between text-xs text-zinc-500"
          title={episodeTitle}
        >
          <span className="truncate">{episodeTitle}</span>
          <div className="shrink-0 ">
            <Badge variant={'outline'}>{percentage}%</Badge>
          </div>
        </div>
      </div>
    </li>
  )
}

const FunctionArea = () => {
  const [appSettings, setAppSettings] = useAppSettings()
  return (
    <div className="no-drag-region flex items-center space-x-2 text-zinc-500">
      {!isWeb && (
        <Toggle
          size="sm"
          aria-label="Thumbnail and poster switch"
          className="text-2xl"
          pressed={appSettings.showPoster}
          onPressedChange={(value) => setAppSettings({ showPoster: value })}
        >
          <i className="icon-[mingcute--pic-line]" />
        </Toggle>
      )}
    </div>
  )
}
