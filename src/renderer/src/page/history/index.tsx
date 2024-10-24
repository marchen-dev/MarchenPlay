import { RouterLayout } from '@renderer/components/layout/RouterLayout'
import { Badge } from '@renderer/components/ui/badge'
import { useToast } from '@renderer/components/ui/toast'
import { db } from '@renderer/database/db'
import type { DB_History } from '@renderer/database/schemas/history'
import { cn, isWeb } from '@renderer/lib/utils'
import { RouteName } from '@renderer/router'
import { useLiveQuery } from 'dexie-react-hooks'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const historyData = useLiveQuery(() => db.history.toArray())

  return (
    <RouterLayout>
      {historyData?.length !== 0 ? (
        <ul className="grid grid-cols-3 gap-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {historyData?.map((item) => <HistoryItem {...item} key={item.episodeId} />)}
        </ul>
      ) : (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
          <i className="icon-[mingcute--folder-info-line] text-6xl " />
          <p className="text-xl">没有内容</p>
        </div>
      )}
    </RouterLayout>
  )
}

const HistoryItem: FC<DB_History> = (props) => {
  const { cover, animeTitle, episodeTitle, progress, duration, episodeId } = props
  const navigation = useNavigate()
  const { toast } = useToast()
  return (
    <li
      className={cn(' flex cursor-default flex-col items-center', !isWeb && 'group')}
      onClick={() => {
        if (isWeb) {
          return toast({
            title: 'Web 版本暂不支持',
            description: '请使用客户端播放',
          })
        }
        return navigation(RouteName.PLAYER, { state: { episodeId } })
      }}
    >
      <div className="relative h-72 w-full overflow-hidden rounded-md ">
        <img
          src={cover}
          className="size-full object-cover transition-all duration-100 group-hover:opacity-85"
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
      <div className="mt-1 w-full px-0.5  ">
        <p className="truncate text-sm" title={animeTitle}>
          {animeTitle}
        </p>
        <div
          className="flex items-center justify-between text-xs text-zinc-500"
          title={episodeTitle}
        >
          <span className="truncate">{episodeTitle}</span>
          <div className="shrink-0 ">
            <Badge variant={'outline'}>{Math.round((progress / duration) * 100) || 0}%</Badge>
          </div>
        </div>
      </div>
    </li>
  )
}
