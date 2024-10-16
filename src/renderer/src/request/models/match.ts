import type { ReponseBaseModel } from './base'

/**
 * 视频文件匹配请求模型
 */
export interface MatchVideoRequestModel {
  /**
   * 视频文件名，不包含文件夹名称和扩展名，特殊字符需进行转义。
   */
  fileName: string

  /**
   * 文件前16MB (16x1024x1024 Byte) 数据的32位MD5结果，不区分大小写。
   */
  fileHash: string

  /**
   * 文件总长度，单位为Byte。
   */
  fileSize: number

  /**
   * 32位整数的视频时长，单位为秒。默认为0。
   */
  videoDuration?: number

  /**
   * 匹配模式。
   * 可选值: 'hashAndFileName', 'fileNameOnly', 'hashOnly'
   */
  matchMode?: 'hashAndFileName' | 'fileNameOnly' | 'hashOnly'
}

// 定义 MatchResultV2 接口
export interface MatchResultV2 {
  /**
   * 弹幕库ID
   */
  episodeId: number

  /**
   * 作品ID
   */
  animeId: number

  /**
   * 作品标题
   */
  animeTitle?: string

  /**
   * 剧集标题
   */
  episodeTitle?: string

  /**
   * 作品类别
   * 可选值: 'tvseries', 'tvspecial', 'ova', 'movie', 'musicvideo', 'web', 'other', 'jpmovie', 'jpdrama', 'unknown'
   */
  type?:
    | 'tvseries'
    | 'tvspecial'
    | 'ova'
    | 'movie'
    | 'musicvideo'
    | 'web'
    | 'other'
    | 'jpmovie'
    | 'jpdrama'
    | 'unknown'

  /**
   * 类型描述
   */
  typeDescription?: string

  /**
   * 弹幕偏移时间（弹幕应延迟多少秒出现）。此数字为负数时表示弹幕应提前多少秒出现。
   */
  shift?: number
}

// 定义 MatchResponseV2 接口
export interface MatchResponseV2 extends ReponseBaseModel {
  /**
   * 是否已精确关联到某个弹幕库
   */
  isMatched: boolean

  /**
   * 搜索匹配的结果
   */
  matches?: MatchResultV2[]
}
