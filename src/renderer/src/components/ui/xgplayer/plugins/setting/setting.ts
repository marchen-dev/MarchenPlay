import './index.css'

import { showPlayerSettingSheet } from '@renderer/atoms/player'
import { Plugin } from '@suemor/xgplayer'

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

  private toggleButtonClickFunction() {
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
