import { RouterLayout } from '@renderer/components/layout/RouterLayout'
import { db } from '@renderer/database/db'
import type { DB_History } from '@renderer/database/schemas/history'
import { useLiveQuery } from 'dexie-react-hooks'
import type { FC } from 'react'

export default function History() {
  const historyData = useLiveQuery(() => db.history.toArray())
  return (
    <RouterLayout>
      <div className="grid grid-cols-3 gap-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {historyData?.map((item) => <HistoryItem {...item} key={item.episodeId} />)}
      </div>
    </RouterLayout>
  )
}

const HistoryItem: FC<DB_History> = (props) => {
  const { cover, animeTitle, episodeTitle } = props
  return (
    <div className="flex flex-col items-center">
      <div className="h-72 w-full overflow-hidden rounded-md">
        <img src={cover} className="size-full object-cover" />
      </div>
      <div className="mt-1 w-full px-0.5  ">
        <p className="truncate text-sm" title={animeTitle}>
          {animeTitle}
        </p>
        <p className="truncate text-xs text-zinc-500" title={episodeTitle}>
          {episodeTitle}
        </p>
      </div>
    </div>
  )
}
