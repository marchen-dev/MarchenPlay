import './index.css'

import NotoSansSC from '@renderer/styles/fonts/NotoSansSC.woff2'
import SubtitlesOctopus from 'libass-wasm'
import workerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker.js?url'
import legacyWorkerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url'
import type { ChangeEvent } from 'react'
import { Plugin } from 'xgplayer'

export default class subtitle extends Plugin {
  static readonly pluginName = 'subtitle'
  static readonly pluginClassName = `xgplayer-plugin-${subtitle.pluginName}`

  icon: HTMLDivElement | null | undefined
  constructor(args) {
    super(args)
  }

  static get defaultConfig() {
    return {
      position: this.POSITIONS.CONTROLS_RIGHT,
    }
  }

  afterCreate() {
    this.icon = this.find(`.${subtitle.pluginClassName}`) as HTMLInputElement
    this.icon.onchange = (e: Event) => {
      const changeEvent = e as unknown as ChangeEvent<HTMLInputElement>
      const file = changeEvent.target?.files?.[0]
      if (!file) {
        return
      }
      const url = URL.createObjectURL(file)
      new SubtitlesOctopus({
        fonts: [NotoSansSC],
        video: this.player?.media as HTMLVideoElement,
        subUrl: url,
        workerUrl,
        legacyWorkerUrl,
      })
    }
  }

  importSubtitle() {}

  destroy(): void {
    this.icon = null
  }
  render(): string | HTMLElement {
    return `<div><input type="file" accept=".srt,.ass,.ssa,.vtt" class="${subtitle.pluginClassName}"/></div>`
  }
}
