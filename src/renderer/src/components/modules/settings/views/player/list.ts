import type { SelectGroup } from '../SettingSelect'

export const danmakuFontSizeList = [
  {
    label: '极小',
    value: '21',
  },
  {
    label: '较小',
    value: '23',
  },
  {
    label: '适中',
    value: '25',
  },
  {
    label: '较大',
    value: '27',
  },
  {
    label: '极大',
    value: '29',
  },
] satisfies SelectGroup[]

export const danmakuDurationList = [
  {
    label: '极慢',
    value: '17000',
  },
  {
    label: '较慢',
    value: '19000',
  },
  {
    label: '适中',
    value: '15000',
  },
  {
    label: '较快',
    value: '13000',
  },
  {
    label: '极快',
    value: '10000',
  },
] satisfies SelectGroup[]
