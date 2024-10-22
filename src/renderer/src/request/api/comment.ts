import type { CommentsModel } from '../models/comment'
import { Get } from '../ofetch'

export enum Commentkeys {
  getDanmu = 'getDanmu',
}

function getDanmu(episodeId: number, params?: { chConvert: number }) {
  return Get<CommentsModel>(`/comment/${episodeId}`, {
    withRelated: true,
    ...params,
  })
}

export const comment = {
  getDanmu,
  Commentkeys,
}
