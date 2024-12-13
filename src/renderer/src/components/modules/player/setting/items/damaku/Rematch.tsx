import { FieldLayout } from '@renderer/components/modules/settings/views/Layout'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import * as React from 'react'
import { memo } from 'react'


export const Rematch = memo(() => {
  // const currentMatchedVideo = useAtomValue(currentMatchedVideoAtom)
  // const video = useAtomValue(videoAtom)
  // const player = usePlayerInstance()
  // const { danmaku } = useSettingConfig()
  // const matchedDanmaku = useMemo(() => {
  //   if (currentMatchedVideo.animeTitle && currentMatchedVideo.episodeTitle) {
  //     return `${currentMatchedVideo.animeTitle} - ${currentMatchedVideo?.episodeTitle}`
  //   }
  //   return '暂无'
  // }, [currentMatchedVideo])

  return (
      <FieldLayout title="来源">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {/* <Select defaultValue={'-1'}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="弹幕库" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {danmaku?.map((item) => {
              const danmakuPlatform = danmakuPlatformMap(item)
              return (
                <SelectItem key={item.source} value={item.source}>
                  {danmakuPlatform}
                </SelectItem>
              )
            })}
            <SelectLabel
              className="cursor-default select-none transition-colors duration-150 hover:text-primary"
              onClick={() => {
                player?.pause()
                jotaiStore.set(playerSettingSheetAtom, false)
                showMatchAnimeDialog(true, video.hash)
              }}
            >
              重新匹配弹幕库
            </SelectLabel>
          </SelectGroup>
        </SelectContent>
      </Select> */}
      </FieldLayout>
  )
})
