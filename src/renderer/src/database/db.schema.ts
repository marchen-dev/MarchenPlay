import { TABLES } from './constants'

export const dbSchemaV1 = {
  // [TABLES.APP]: '++id, fontSize',
  // [TABLES.PLAYER]: '++id, duration',
  // [TABLES.DANMAKU]: '&type, duration, fontSize',
  [TABLES.HISTORY]: '&episodeId, path, animeId, animeTitle, episodeTitle, progress, cover, danmaku',
}
