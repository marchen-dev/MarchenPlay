import type { CommentsModel } from '@renderer/request/models/comment'

export interface DB_History {
  path: string
  animeId: number
  episodeId: number
  animeTitle: string
  episodeTitle: string
  progress?: number
  duration?: number
  cover: string
  danmaku: CommentsModel
}
