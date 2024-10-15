import type { ReponseBaseModel } from './base'

interface EpisodeModel {
  episodeId: number
  episodeTitle: string
}

interface AnimeModel {
  animeId: number
  animeTitle: string
  type: string
  typeDescription: string
  episodes: EpisodeModel[]
}

export interface SearchAnimeModel extends ReponseBaseModel {
  hasMore: boolean
  animes: AnimeModel[]
}

export interface SearchAnimeRequestModel {
  anime: string
  episode?: string
}
