import { useSettingModal } from '@renderer/components/modules/settings/hooks'
import { handlers } from '@renderer/lib/client'
import { useEffect } from 'react'

export const TipcListener = () => {
  const showModal = useSettingModal()
  useEffect(() => {
    const unlisten = handlers?.showSetting.listen(() => {
      // 防止关闭窗口过程中，再次打开窗口，导致窗口无法打开
      const timeoutId = setTimeout(() => {
        showModal()
      }, 10)
      return () => clearTimeout(timeoutId)
    })
    return unlisten
  }, [showModal])
  return null
}
