import { useSettingModal } from '@renderer/components/modules/settings/hooks'
import { handlers } from '@renderer/lib/client'
import { useEffect } from 'react'

export const TipcListener = () => {
  //TODO 防止窗口多开
  const showModal = useSettingModal()
  useEffect(() => {
    const unlisten = handlers?.showSetting.listen(() => {
      showModal()
    })
    return unlisten
  }, [showModal])
  return null
}
