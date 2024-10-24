import type { MatchedVideoType } from '@renderer/atoms/player'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@renderer/components/ui/accordion'
import { Button } from '@renderer/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { ScrollArea } from '@renderer/components/ui/scrollArea'
import { useToast } from '@renderer/components/ui/toast'
import type { MatchResponseV2, MatchResultV2 } from '@renderer/request/models/match'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'

import { showMatchAnimeDialogAtom, useSearchAnime } from './hooks'

interface MatchAnimeDialogProps {
  matchData?: MatchResponseV2
  onSelected?: (params?: MatchedVideoType) => void
  onClosed?: () => void
}

export const MatchAnimeDialog: FC<MatchAnimeDialogProps> = (props) => {
  const { handleSearchAnime, searchData } = useSearchAnime()
  const { matchData, onSelected, onClosed } = props
  const [showMatchAnimeDialog, setShowMatchAnimeDialog] = useAtom(showMatchAnimeDialogAtom)
  const { toast } = useToast()

  useEffect(() => {
    if (matchData && !matchData.isMatched) {
      setShowMatchAnimeDialog(true)
    }
    return () => setShowMatchAnimeDialog(false)
  }, [matchData, setShowMatchAnimeDialog])

  const accordionData = useMemo(() => {
    if (searchData) {
      return searchData.animes.map((anime) => {
        return anime.episodes.map((episode) => ({
          animeId: anime.animeId,
          animeTitle: anime.animeTitle,
          episodeId: episode.episodeId,
          episodeTitle: episode.episodeTitle,
        })) as MatchResultV2[]
      })
    }

    if (!matchData?.matches) return []

    const groupMatches = matchData.matches.reduce(
      (acc, match) => {
        if (!acc[match.animeId]) {
          acc[match.animeId] = []
        }

        acc[match.animeId].push(match)
        return acc
      },
      {} as Record<number, MatchResultV2[]>,
    )
    return Object.values(groupMatches)
  }, [matchData, searchData])
  return (
    <Dialog open={showMatchAnimeDialog} onOpenChange={(open) => setShowMatchAnimeDialog(open)}>
      <DialogContent
        className="max-h-[80vh] min-h-[700px] sm:max-w-[725px]"
        onClosed={onClosed}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">请手动选择弹幕库</DialogTitle>
        </DialogHeader>
        <div>
          <Input placeholder="匹配的不正确? 手动输入动漫匹配弹幕库" onChange={handleSearchAnime} />
          <ScrollArea className="relative mt-3 h-[450px] rounded-md border px-4">
            <Accordion type="single" collapsible className="w-full">
              {accordionData?.length === 0 && (
                <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  暂无匹配的弹幕库
                </p>
              )}
              {accordionData?.map((match) => {
                const { animeId, animeTitle } = match[0]

                return (
                  <AccordionItem key={animeId} value={`${animeId}`}>
                    <AccordionTrigger>{animeTitle}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="mt-2 space-y-5 ">
                        {match.map((item) => (
                          <li
                            key={item.episodeId}
                            onClick={() => {
                              onSelected &&
                                onSelected({
                                  episodeId: item.episodeId,
                                  animeId: item.animeId,
                                  animeTitle: item.animeTitle || '',
                                  episodeTitle: item.episodeTitle || '',
                                })
                              setShowMatchAnimeDialog(false)
                              toast({
                                title: '已选择弹幕库',
                                description: `已选择 ${animeTitle} ${item.episodeTitle}`,
                              })
                            }}
                            className="hover:text-info"
                          >
                            {item.episodeTitle}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </ScrollArea>
          <div className="flex justify-end">
            <Button
              variant={'secondary'}
              className="mt-5 flex items-center text-sm"
              onClick={() => onSelected && onSelected()}
            >
              <i className="icon-[mingcute--xls-line] mr-1 text-lg" />
              <span>不加载弹幕，直接播放</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
