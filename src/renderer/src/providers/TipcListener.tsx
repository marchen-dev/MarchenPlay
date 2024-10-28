import { useVideo } from '@renderer/components/modules/player/hooks'
import { useSettingModal } from '@renderer/components/modules/settings/hooks'
import { settingTabs } from '@renderer/components/modules/settings/tabs'
import { handlers } from '@renderer/lib/client'
import { RouteName } from '@renderer/router'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const TipcListener = () => {
  const showModal = useSettingModal()
  const { importAnimeViaIPC } = useVideo()
  const navigation = useNavigate()
  useEffect(() => {
    const unlisten = [
      handlers?.showSetting.listen(() => {
        // 防止关闭窗口过程中，再次打开窗口，导致窗口无法打开
        const timeoutId = setTimeout(() => {
          showModal()
        }, 10)
        return () => clearTimeout(timeoutId)
      }),

      handlers?.showSetting.listen((tab) => {
        const showTab = settingTabs.find((settingTab) => settingTab.title === tab)

        return showModal({ settingTabsModel: showTab })
      }),

      handlers?.importAnime.listen(() => {
        navigation(RouteName.PLAYER)
        importAnimeViaIPC()
      }),
    ]

    return () => {
      unlisten?.forEach((fn) => fn?.())
    }
  }, [showModal])
  return null
}
