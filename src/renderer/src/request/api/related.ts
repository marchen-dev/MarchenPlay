import type { relatedPlatformModel } from '../models/related'
import { Get } from '../ofetch'

export enum relatedkeys {
  getRelatedDanmakuByEpisodeId = 'getRelatedDanmakuByEpisodeId',
}

function getRelatedDanmakuByEpisodeId(episodeId: number) {
  return Get<relatedPlatformModel>(`/related/${episodeId}`)
}

export const related = {
  getRelatedDanmakuByEpisodeId,
  relatedkeys,
}
