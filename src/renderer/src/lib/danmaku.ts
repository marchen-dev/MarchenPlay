import type { DB_Danmaku } from '@renderer/database/schemas/history'

/**
 * 将32位整数表示的颜色转换成十六进制颜色格式
 * @param color 32位整数表示的颜色
 * @returns 十六进制颜色格式字符串，例如 #ffffff
 */
export function intToHexColor(color: number): string {
  // 提取红色分量
  const r = (color >> 16) & 0xff
  // 提取绿色分量
  const g = (color >> 8) & 0xff
  // 提取蓝色分量
  const b = color & 0xff

  // 将每个分量转换成两位的十六进制字符串
  const rHex = r.toString(16).padStart(2, '0')
  const gHex = g.toString(16).padStart(2, '0')
  const bHex = b.toString(16).padStart(2, '0')

  // 拼接结果
  return `#${rHex}${gHex}${bHex}`
}

type Mode = 'top' | 'bottom' | 'scroll'
export const DanmuPosition: Record<number, Mode> = {
  1: 'scroll',
  4: 'bottom',
  5: 'top',
}

const thirdpartyDanmakuMap = {
  bilibili: '哔哩哔哩',
  'ani.gamer.com.tw': '巴哈姆特动漫疯',
  acfun: 'acfun',
  tucao: '吐槽弹幕网',
  iqiyi: '爱奇艺',
  youku: '优酷',
}

export const danmakuPlatformMap = (danmaku: DB_Danmaku) => {
  let mapName = ''

  switch (danmaku.type) {
    case 'dandanplay': {
      mapName = '弹弹play'
      break
    }
    case 'local': {
      mapName = '本地弹幕'
      break
    }

    case 'third-party-manual':
    case 'third-party-auto': {
      Object.entries(thirdpartyDanmakuMap).forEach(([key, value]) => {
        danmaku.source?.includes(key) && (mapName = value)
      })
      if (!mapName) {
        mapName = new URL(danmaku.source || '').hostname
      }
      break
    }
    default: {
      mapName = '未知弹幕'
      break
    }
  }

  return `${mapName} (${danmaku.content.comments.length}条)`
}
