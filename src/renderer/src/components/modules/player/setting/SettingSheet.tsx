import { playerSettingSheetAtom } from '@renderer/atoms/player'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@renderer/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@renderer/components/ui/sheet'
import { useAtom } from 'jotai'

export const SettingSheet = () => {
  const [show, setShow] = useAtom(playerSettingSheetAtom)
  return (
    <Sheet open={show} onOpenChange={setShow}>
      <SheetContent
        container={document.querySelector(`.xgplayer`)}
        classNames={{ sheetOverlay: 'bg-black/20' }}
      >
        <SheetHeader>
          <SheetTitle>设置</SheetTitle>

          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['item-1', 'item-2', 'item-3']}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>弹幕设置</AccordionTrigger>
              <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>字幕设置</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>音频设置</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
