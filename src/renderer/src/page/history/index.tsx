import { useAppSettings, useAppSettingsValue } from '@renderer/atoms/settings/app'
import {
  FunctionAreaButton,
  FunctionAreaToggle,
} from '@renderer/components/layout/header/FunctionAreaButton'
import { RouterLayout } from '@renderer/components/layout/RouterLayout'
import { Badge } from '@renderer/components/ui/badge'
import { ScrollArea } from '@renderer/components/ui/scrollArea'
import { useToast } from '@renderer/components/ui/toast'
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
              <HistoryItem {...item} showPoster={showPoster || isWeb} key={item.episodeId} />
            ))}
          </ul>
        ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
            <i className="icon-[mingcute--file-more-line] text-6xl " />
            <p className="text-xl">没有内容</p>
          </div>
        )}
      </ScrollArea>
    </RouterLayout>
  )
}

interface HistoryItemProps extends DB_History {
  showPoster: boolean
}

const HistoryItem: FC<HistoryItemProps> = (props) => {
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
      className={cn('flex cursor-default select-none flex-col items-center', !isWeb && 'group')}
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
      <div className={cn('relative w-full overflow-hidden rounded-md', showPoster && 'h-72')}>
        <img
          src={showPoster ? cover : (thumbnail ?? cover)}
          className={cn(
            'pointer-events-none aspect-video size-full object-cover transition-all duration-100 group-hover:opacity-85',
            showPoster && 'aspect-auto',
          )}
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
    <div className="no-drag-region flex items-center space-x-2 text-2xl text-zinc-500 ">
      {!isWeb && (
        <FunctionAreaToggle
          pressed={appSettings.showPoster}
          onPressedChange={(value) => setAppSettings({ showPoster: value })}
        >
          <i className="icon-[mingcute--pic-line]" />
        </FunctionAreaToggle>
      )}
      <FunctionAreaButton onClick={()=>{
        
      }}>
        <i className="icon-[mingcute--delete-2-line]" />
      </FunctionAreaButton>
    </div>
  )
}
