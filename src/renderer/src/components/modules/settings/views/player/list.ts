import type { SelectGroup } from '../Select'

export const danmakuFontSizeList = [
  {
    label: '极小',
    value: '22',
  },
  {
    label: '较小',
    value: '24',
  },
  {
    label: '适中',
    value: '26',
    default: true,
  },
  {
    label: '较大',
    value: '28',
  },
  {
    label: '极大',
    value: '30',
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
    default: true,
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

export const danmakuEndAreaList = [
  {
    label: '10%',
    value: '0.1',
  },
  {
    label: '25%',
    value: '0.25',
    default: true,
  },
  {
    label: '50%',
    value: '0.5',
  },
  {
    label: '75%',
    value: '0.75',
  },
  {
    label: '100%',
    value: '1',
  },
] satisfies SelectGroup[]
