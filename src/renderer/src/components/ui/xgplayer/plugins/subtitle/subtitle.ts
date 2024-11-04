import { toast } from '@renderer/components/ui/toast'
import { tipcClient } from '@renderer/lib/client'
import { isWeb } from '@renderer/lib/utils'
import NotoSansSC from '@renderer/styles/fonts/NotoSansSC.woff2'
import SubtitlesOctopus from 'libass-wasm'
import workerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker.js?url'
import legacyWorkerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url'
import type { ChangeEvent } from 'react'
import { Plugin } from 'xgplayer'

import { subtitlePopoverToString } from './Popover'

export default class subtitle extends Plugin {
  static readonly pluginName = 'subtitle'
  private readonly pluginClassName = `xgplayer-plugin-${subtitle.pluginName}`

  icon: HTMLElement | HTMLInputElement | undefined
  constructor(args) {
    super(args)
  }

  static get defaultConfig() {
    return {
      position: this.POSITIONS.CONTROLS_RIGHT,
    }
  }

  afterCreate() {
    this.icon = this.find(`.${this.pluginClassName}`) as HTMLElement | HTMLInputElement
    if (isWeb) {
      this.icon.onchange = (e: Event) => {
        this.importSubtitleFromBrowser(e as unknown as ChangeEvent<HTMLInputElement>)
      }
      return
    }

    this.icon.onclick = () => {
      this.importSubtitleFromClient()
    }
  }

  importSubtitleFromBrowser(e: ChangeEvent<HTMLInputElement>) {
    try {
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
      toast({
        title: '导入字幕成功',
        duration: 1500,
      })
    } catch {
      toast({
        variant: 'destructive',
        title: '导入字幕失败',
      })
    }
  }

  async importSubtitleFromClient() {
    await tipcClient?.importSubtitle()
  }

  destroy(): void {
    this.icon = undefined
  }

  render(): string {
    return subtitlePopoverToString
  }
}
