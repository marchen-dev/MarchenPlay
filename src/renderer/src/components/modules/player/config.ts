import fullEntireScreen from '@renderer/components/ui/xgplayer/plugins/fullScreen'
import Setting from '@renderer/components/ui/xgplayer/plugins/setting'
import type { IPlayerOptions } from '@suemor/xgplayer'

const playerBaseConfigForClient = {
  height: '100%',
  width: '100%',
  lang: 'zh',
  fullscreenTarget: document.body,
  autoplay: true,
  miniprogress: true,
  closeVideoDblclick: true,
  closeVideoClick: true,
  [fullEntireScreen.pluginName]: {
    index: 0,
  },
  cssFullscreen: {
    index: 1,
  },
  [Setting.pluginName]: {
    index: 2,
  },
  volume: {
    index: 3,
    default: 1,
  },
  rotate: {
    index: 4,
  },
  playbackRate: {
    index: 5,
  },
  keyboard: {
    keyCodeMap: {
      esc: {
        disable: true,
      },
    },
  },
  plugins: [Setting, fullEntireScreen],
  ignores: ['fullscreen'],
} satisfies IPlayerOptions

const playerBaseConfigForWeb = {
  height: '100%',
  width: '100%',
  lang: 'zh',
  autoplay: true,
  miniprogress: true,
  fullscreen: {
    index: 0,
  },
  cssFullscreen: {
    index: 1,
  },
  [Setting.pluginName]: {
    index: 2,
  },
  volume: {
    index: 3,
    default: 1,
  },
  rotate: {
    index: 4,
  },
  playbackRate: {
    index: 5,
  },
  plugins: [Setting],
} satisfies IPlayerOptions

const danmakuConfig = {
  fontSize: 25,
  area: {
    start: 0,
    end: 0.25,
  },
  ext: {
    mouseControl: true,
    mouseControlPause: true,
  },
}

export { danmakuConfig,playerBaseConfigForClient, playerBaseConfigForWeb }
