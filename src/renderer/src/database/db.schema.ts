import { TABLES } from './constants'

export const dbSchemaV1 = {
  // [TABLES.APP]: '++id, fontSize',
  // [TABLES.PLAYER]: '++id, duration',
  // [TABLES.DANMAKU]: '&type, duration, fontSize',
  [TABLES.HISTORY]:
    '++id, path, animeId, episodeId, animeTitle, episodeTitle, progress, cover, danmaku',
}
