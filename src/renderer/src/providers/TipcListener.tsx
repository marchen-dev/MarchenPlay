import { updateProgressAtom } from '@renderer/atoms/network'
import type { useAppSettingsValue } from '@renderer/atoms/settings/app'
import { appSettingAtom } from '@renderer/atoms/settings/app'
import { jotaiStore } from '@renderer/atoms/store'
import { useVideo } from '@renderer/components/modules/player/loading/hooks'
import { useSettingModal } from '@renderer/components/modules/settings/hooks'
import { settingTabs } from '@renderer/components/modules/settings/tabs'
import { toast } from '@renderer/components/ui/toast/use-toast'
import { handlers } from '@renderer/lib/client'
import { getStorageNS } from '@renderer/lib/ns'
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
      handlers?.updateProgress.listen((params) => {
        jotaiStore.set(updateProgressAtom, { progress: params.progress, status: params.status })
      }),
      handlers?.getReleaseNotes.listen((text) => {
        try {
          const appDataString = localStorage.getItem(getStorageNS('app'));
          const appData = appDataString ? JSON.parse(appDataString) as ReturnType<
            typeof useAppSettingsValue
          > : null;
          
          if (appData?.showUpdateNote) {
            toast({
              title: '更新成功 🎉',
              description: text,
              duration: 8000,
            })
            jotaiStore.set(appSettingAtom, { ...appData, showUpdateNote: false })
          }
        } catch (error) {
          console.error(error)
        }
      }),
    ]

    return () => {
      unlisten?.forEach((fn) => fn?.())
    }
  }, [showModal])
  return null
}
