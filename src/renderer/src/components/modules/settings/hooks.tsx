import { useModalStack } from '@renderer/components/ui/modal'
import { useCallback } from 'react'

import { ModalTitle, SettingModal } from '.'
import { SettingProvider } from './provider'
import { settingTabs } from './tabs'

export const useSettingModal = () => {
  const { present, id } = useModalStack()
  return useCallback(() => {
    present({
      id: 'SETTING',
      title: <ModalTitle />,
      overlay: true,
      classNames: {
        modalClassName:
          'min-w-[600px] pb-0 pr-0 w-[800px] max-w-[95vw] min-h-[580px] h-[700px] max-h-[80vh]',
      },
      content: () => (
        <SettingProvider data={settingTabs[0]}>
          <SettingModal />
        </SettingProvider>
      ),
    })
    return id
  }, [present])
}
