import { MARCHEN_PROTOCOL_PREFIX } from '@main/constants/protocol'
import { toast } from '@renderer/components/ui/toast'
import { tipcClient } from '@renderer/lib/client'
import NotoSansSC from '@renderer/styles/fonts/NotoSansSC.woff2?url'
import SubtitlesOctopus from 'libass-wasm'
import workerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker.js?url'
import legacyWorkerUrl from 'libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url'
import type { ChangeEvent } from 'react'
import { Plugin } from 'xgplayer'

import { subtitlePopoverToString } from './Popover'

export default class subtitle extends Plugin {
  static readonly pluginName = 'subtitle'
  private readonly pluginClassName = {
    popoverContainer: `xgplayer-plugin-${subtitle.pluginName}-popover-container`,
    toggleButton: `xgplayer-plugin-${subtitle.pluginName}-toggle-button`,
    popoverContent: `xgplayer-plugin-${subtitle.pluginName}-popover-content`,
  }

  popoverContainer: HTMLDivElement | undefined
  toggleButton: HTMLDivElement | undefined
  popoverContent: HTMLDivElement | undefined
  private handleClickOutside: (event: MouseEvent) => void
  private toggleButtonClickListener: () => void

  constructor(args) {
    super(args)

    this.popoverContainer = this.find(`.${this.pluginClassName.popoverContainer}`) as HTMLDivElement
    this.toggleButton = this.find(`.${this.pluginClassName.toggleButton}`) as HTMLDivElement
    this.popoverContent = this.find(`.${this.pluginClassName.popoverContent}`) as HTMLDivElement

    this.handleClickOutside = this.handleClickOutsideFunction.bind(this)
    this.toggleButtonClickListener = this.toggleButtonClickFunction.bind(this)
  }

  static get defaultConfig() {
    return {
      position: this.POSITIONS.CONTROLS_RIGHT,
    }
  }

  afterCreate() {
    this.toggleButton?.addEventListener('click', this.toggleButtonClickListener)
    document.addEventListener('mousedown', this.handleClickOutside)
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

  private handleClickOutsideFunction(event: MouseEvent) {
    if (this.popoverContainer && !this.popoverContainer.contains(event.target as Node)) {
      this.popoverContent?.classList.add('hidden')
      this.popoverContent?.classList.remove('block')
    }
  }

  private toggleButtonClickFunction() {
    if (this.popoverContent?.classList.contains('hidden')) {
      this.popoverContent?.classList.remove('hidden')
      this.popoverContent?.classList.add('block')
    } else {
      this.popoverContent?.classList.add('hidden')
      this.popoverContent?.classList.remove('block')
    }
  }

  destroy(): void {
    this.toggleButton?.removeEventListener('click', this.toggleButtonClickListener)
    document.removeEventListener('mousedown', this.handleClickOutside)
    this.popoverContainer = undefined
    this.popoverContent = undefined
    this.toggleButton = undefined
  }

  render(): string {
    return subtitlePopoverToString
  }
}
