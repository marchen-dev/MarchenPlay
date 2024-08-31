import type { CommentsModel } from '../models/comment'
import { Get } from '../ofetch'

export enum Commentkeys {
  getDanmu = 'getDanmu',
}

function getDanmu(episodeId: string) {
  return Get<CommentsModel>(`/comment/${episodeId}`, {
    withRelated: true,
  })
}

export const comment = {
  getDanmu,
  Commentkeys,
}