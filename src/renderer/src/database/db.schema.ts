import { TABLES } from './constants'

export const dbSchemaV1 = {
  // [TABLES.APP]: '++id, fontSize',
  // [TABLES.PLAYER]: '++id, duration',
  // [TABLES.DANMAKU]: '&type, duration, fontSize',
  [TABLES.HISTORY]:
    '&episodeId, animeId, path, animeTitle, episodeTitle, progress, duration, cover, danmaku',
}
