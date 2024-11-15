import { playerSettingSheetAtom } from '@renderer/atoms/player'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@renderer/components/ui/accordion'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@renderer/components/ui/sheet'
import { useAtom } from 'jotai'

import { Audio } from './items/Audio'
import { Danmaku } from './items/Danmaku'
import { Subtitle } from './items/Subtitle'

export const SettingSheet = () => {
  const [show, setShow] = useAtom(playerSettingSheetAtom)
  return (
    <Sheet
      open={show}
      onOpenChange={(open) => {
        setShow(open)
      }}
    >
      <SheetContent
        container={document.querySelector(`.xgplayer`)}
        classNames={{ sheetOverlay: 'bg-black/20' }}
      >
        <SheetHeader>
          <SheetTitle>设置</SheetTitle>

          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['danmaku', 'subtitle', 'audio']}
          >
            <AccordionItem value="danmaku">
              <AccordionTrigger>弹幕设置</AccordionTrigger>
              <AccordionContent>
                <Danmaku />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="subtitle">
              <AccordionTrigger>字幕设置</AccordionTrigger>
              <AccordionContent>
                <Subtitle />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="audio">
              <AccordionTrigger>音频设置</AccordionTrigger>
              <AccordionContent>
                <Audio />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
