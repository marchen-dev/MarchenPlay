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

type Mode = 0 | 1 | 2
export const DanmuPosition: Record<number, Mode> = {
  1: 0,
  4: 1,
  5: 2,
}
