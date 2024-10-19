import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select'

import { FieldLayout, FieldsCardLayout, SettingViewContainer } from '../Layout'

export const PlayerView = () => {
  return (
    <SettingViewContainer>
      <FieldsCardLayout title="播放" />
      <FieldsCardLayout title="弹幕 ">
        <FieldLayout title="字体大小">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FieldLayout>
        <FieldLayout title="持续时间" />
      </FieldsCardLayout>
    </SettingViewContainer>
  )
}
