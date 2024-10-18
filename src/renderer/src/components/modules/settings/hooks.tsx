import { useModalStack } from '@renderer/components/ui/modal'
import { useCallback } from 'react'

import { ModalTitle, SettingModal } from '.'
import { SettingProvider } from './provider'
import { settingTabs } from './tabs'

export const useSettingModal = () => {
  const { present } = useModalStack()
  return useCallback(() => {
    present({
      title: <ModalTitle />,
      overlay: true,
      classNames: {
        modalClassName: 'min-w-[600px] w-[800px] max-w-[95vw] min-h-[500px] h-[700px] max-h-[80vh]',
      },
      content: () => (
        <SettingProvider data={settingTabs[0]}>
          <SettingModal />
        </SettingProvider>
      ),
    })
  }, [present])
}
