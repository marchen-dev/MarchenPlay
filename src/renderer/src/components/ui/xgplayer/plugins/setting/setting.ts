import './index.css'

import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import { showPlayerSettingSheet } from '@renderer/atoms/player'
import { toast } from '@renderer/components/ui/toast'
import { tipcClient } from '@renderer/lib/client'
import NotoSansSC from '@renderer/styles/fonts/NotoSansSC.woff2?url'
import { Plugin } from '@suemor/xgplayer'
import SubtitlesOctopus from 'libass-wasm'
import workerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker.js?url'
import legacyWorkerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url'
import type { ChangeEvent } from 'react'

export default class setting extends Plugin {
  static readonly pluginName = 'setting'
  static readonly pluginClassName = {
    icon: `xgplayer-plugin-${setting.pluginName}-icon`,
  }

  icon: HTMLElement | undefined
  private toggleButtonClickListener: () => void

  constructor(args) {
    super(args)

    this.icon = this.find(`.${setting.pluginClassName.icon}`) as HTMLDivElement

    this.toggleButtonClickListener = this.toggleButtonClickFunction.bind(this)
  }

  static get defaultConfig() {
    return {
      position: this.POSITIONS.CONTROLS_RIGHT,
    }
  }

  afterCreate() {
    this.icon?.addEventListener('click', this.toggleButtonClickListener)
  }

  importSubtitleFromBrowser(e: ChangeEvent<HTMLInputElement>) {
    const changeEvent = e as unknown as ChangeEvent<HTMLInputElement>
    const file = changeEvent.target?.files?.[0]
    if (!file) {
      return
    }
    const url = URL.createObjectURL(file)
    new SubtitlesOctopus({
      fonts: [NotoSansSC],
      fallbackFont: NotoSansSC,
      video: this.player?.media as HTMLVideoElement,
      subUrl: url,
      workerUrl,
      legacyWorkerUrl,
    })
    toast({
      title: '导入字幕成功',
      duration: 1500,
    })
  }

  async importSubtitleFromClient() {
    const subtitlePath = await tipcClient?.importSubtitle()
    if (!subtitlePath) {
      return
    }
    new SubtitlesOctopus({
      fonts: [NotoSansSC],
      fallbackFont: NotoSansSC,
      video: this.player?.media as HTMLVideoElement,
      subUrl: `${MARCHEN_PROTOCOL_PREFIX}${subtitlePath}`,
      workerUrl,
      legacyWorkerUrl,
    })
    toast({
      title: '导入字幕成功',
      duration: 1500,
    })
  }

  private toggleButtonClickFunction() {
    // this.importSubtitleFromClient()
    showPlayerSettingSheet()
  }

  destroy(): void {
    this.icon?.removeEventListener('click', this.toggleButtonClickListener)
    this.icon = undefined
  }

  render(): string {
    return `<div>
    <i class="${setting.pluginClassName.icon} xgplayer-setting"/>
    </div>`
  }
}
