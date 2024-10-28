import { Button } from '@renderer/components/ui/button'
import { useModalStack } from '@renderer/components/ui/modal'
import { tipcClient } from '@renderer/lib/client'
import { isWeb } from '@renderer/lib/utils'
import { useCallback } from 'react'

interface showConfirmationBox {
  title: string
  handleConfirm?: () => void
  handleCancel?: () => void
}

export const useDialog = () => {
  const { present } = useModalStack()

  return useCallback(
    (params: showConfirmationBox) => {
      if (isWeb) {
        return present({
          id: 'DIALOG',
          title: params.title,
          overlay: true,
          content: ({ dismiss }) => (
            <div>
              <Button
                onClick={() => {
                  params.handleConfirm?.()
                  dismiss()
                }}
              >
                Confirm
              </Button>
              <Button
                onClick={() => {
                  params.handleCancel?.()
                  dismiss()
                }}
              >
                Cancel
              </Button>
            </div>
          ),
        })
      }
      tipcClient?.clearHistoryDialog({ title: params.title }).then((result) => {
        if (!result) {
          return params.handleCancel?.()
        }
        params.handleConfirm?.()
      })
      return
    },
    [present],
  )
}
