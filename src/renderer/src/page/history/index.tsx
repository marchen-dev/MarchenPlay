import { RouterLayout } from '@renderer/components/layout/RouterLayout'
import { Badge } from '@renderer/components/ui/badge'
import { db } from '@renderer/database/db'
import type { DB_History } from '@renderer/database/schemas/history'
import { cn } from '@renderer/lib/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import type { FC } from 'react'

export default function History() {
  const historyData = useLiveQuery(() => db.history.toArray())

  return (
    <RouterLayout>
      {historyData?.length !== 0 ? (
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {historyData?.map((item) => <HistoryItem {...item} key={item.episodeId} />)}
        </div>
      ) : (
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500'>
          <i className="icon-[mingcute--folder-info-line] text-6xl " />
          <p className='text-xl'>没有内容</p>
        </div>
      )}
    </RouterLayout>
  )
}

const HistoryItem: FC<DB_History> = (props) => {
  const { cover, animeTitle, episodeTitle, progress, duration } = props
  return (
    <div className="group flex cursor-default flex-col items-center">
      <div className="relative h-72 w-full overflow-hidden rounded-md ">
        <img
          src={cover}
          className="size-full object-cover transition-all duration-100 group-hover:blur-[1px]"
        />
        <i
          className={cn(
            'icon-[mingcute--play-circle-line]',
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-100',
            'size-16 text-white opacity-0 shadow-md group-hover:opacity-100',
          )}
        />
      </div>
      <div className="mt-1 w-full px-0.5  ">
        <p className="truncate text-sm" title={animeTitle}>
          {animeTitle}
        </p>
        <div
          className="flex items-center justify-between truncate text-xs text-zinc-500"
          title={episodeTitle}
        >
          <span>{episodeTitle}</span>
          {duration && progress && (
            <Badge className='px-2' variant={'outline'}>{Math.round((progress / duration) * 100)}%</Badge>
          )}
        </div>
      </div>
    </div>
  )
}
