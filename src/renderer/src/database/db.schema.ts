import { TABLES } from './constants'

export const dbSchemaV1 = {
  [TABLES.HISTORY]:
    '&animeId, episodeId, path, animeTitle, episodeTitle, progress, duration, cover, danmaku, updatedAt',
}
