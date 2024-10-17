import { ScrollArea  } from '@renderer/components/ui/scrollArea'

export const SettingModal = () => {
  return (
    <div className="flex ">
      <div className="w-[140px]">
        <ul>
          <li className="flex items-center gap-1">
            <i className="icon-[mingcute--t-shirt-2-line]" />
            <span>外观</span>
          </li>
          <li className="flex items-center gap-1">
            <i className="icon-[mingcute--video-camera-line]" />
            <span>播放</span>
          </li>
        </ul>
      </div>
      <div className="mx-5 w-px bg-base-300" />
        <div className="min-h-[calc(700px-90px)] flex-1">
          <ScrollArea>
            <div>11111</div>
          </ScrollArea>
        </div>
    </div>
  )
}
