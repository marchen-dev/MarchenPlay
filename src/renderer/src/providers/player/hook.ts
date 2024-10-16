import { videoAtom } from '@renderer/atoms/player'
import { apiClient } from '@renderer/request'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

export const useMatchAnimeData = () => {
  const { hash, size, name, url } = useAtomValue(videoAtom)
  const { data: matchData } = useQuery({
    queryKey: [apiClient.match.Matchkeys, url],
    queryFn: () =>
      apiClient.match.postVideoEpisodeId({ fileSize: size, fileHash: hash, fileName: name }),
    enabled: !!hash,
  })

  return { matchData, url }
}
