import type { BangumiDetailResponseModel } from '../models/bangumi'
import { Get } from '../ofetch'

function getBangumiDetailById(animeId: number) {
  return Get<BangumiDetailResponseModel>(`/bangumi/${animeId}`)
}

export const bangumi = {
  getBangumiDetailById,
}
