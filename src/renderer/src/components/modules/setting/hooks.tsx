import { useModalStack } from '@renderer/components/ui/modal'
import { useCallback } from 'react'

import { SettingModal } from '.'

export const useSettingModal = () => {
  const { present } = useModalStack()
  return useCallback(() => {
    present({
      title: '设置',
      overlay: true,
      modalClassName: 'min-w-[600px] w-[800px] max-w-[95vw] min-h-[500px] h-[700px] max-h-[80vh] ',
      content: () => <SettingModal />,
    })
  }, [present])
}
