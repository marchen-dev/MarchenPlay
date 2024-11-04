import './index.css'

import { isWeb } from '@renderer/lib/utils'
import { renderToString } from 'react-dom/server'

const SubtitlePopover = () => (
  <div>
    {isWeb ? (
      <input type="file" accept=".srt,.ass,.ssa,.vtt" className="xgplayer-plugin-subtitle" />
    ) : (
      <i className="xgplayer-plugin-subtitle" />
    )}
  </div>
)

export const subtitlePopoverToString = renderToString(<SubtitlePopover />)
