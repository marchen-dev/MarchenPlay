import { playerSettingSheetAtom } from '@renderer/atoms/player'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@renderer/components/ui/accordion'
import { ScrollArea } from '@renderer/components/ui/scrollArea'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@renderer/components/ui/sheet'
import { useAtom } from 'jotai'
import * as React from 'react'

import { MatchDanmakuDialog } from '../../shared/MatchDanmakuDialog'
import { Danmaku } from './items/damaku/Danmaku'
import { Subtitle } from './items/subtitle/Subtitle'

export const SettingSheet = () => {
  const [show, setShow] = useAtom(playerSettingSheetAtom)
  return (
    <>
      <Sheet
        open={show}
        onOpenChange={(open) => {
          setShow(open)
        }}
      >
        <SheetContent
          container={document.querySelector(`.xgplayer`)}
          classNames={{ sheetOverlay: 'bg-black/20' }}
          className="p-0"
          aria-describedby="播放器设置"
        >
          <ScrollArea className="h-full p-6">
            <SheetHeader>
              <SheetTitle>设置</SheetTitle>
              <Accordion
                type="multiple"
                className="w-full"
                defaultValue={['danmaku', 'subtitle', 'audio']}
              >
                {settingSheetList.map((item) => (
                  <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger className="font-semibold">{item.title}</AccordionTrigger>
                    <AccordionContent className="px-1 pt-1">
                      <item.component />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SheetHeader>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <MatchDanmakuDialog />
    </>
  )
}

const settingSheetList = [
  {
    title: '播放列表',
    value: 'playList',
    component: React.lazy(() => import('./items/playList/PlayList')),
  },
  {
    title: '弹幕设置',
    value: 'danmaku',
    component: Danmaku,
  },
  {
    title: '字幕设置',
    value: 'subtitle',
    component: Subtitle,
  },
  // {
  //   title: '音频设置',
  //   value: 'audio',
  //   component: Audio,
  // },
]
