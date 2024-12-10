import type { CommentsModel } from '@renderer/request/models/comment'

export interface DB_History {
  hash: string
  path: string
  animeId?: number
  episodeId?: number
  animeTitle?: string
  episodeTitle?: string
  progress: number
  duration: number
  cover?: string
  thumbnail?: string
  danmaku?: CommentsModel
  subtitles?: Subtitles
  updatedAt: string
}

interface Subtitles {
  defaultId: number
  timeOffset?: number

  tags: Array<{
    id: number
    path: string
    index?: number
    title: string
    language?: string
  }>
}
