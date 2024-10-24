import type { CommentsModel } from '@renderer/request/models/comment'

import type { DB_Base } from './base'

export interface DB_History extends DB_Base {
  path: string
  animeId: number
  episodeId: number
  animeTitle: string
  episodeTitle: string
  progress?: number
  cover: string
  danmaku: CommentsModel
}
