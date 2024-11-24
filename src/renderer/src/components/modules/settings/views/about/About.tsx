import { version } from '@pkg'
import { Logo } from '@renderer/components/icons/Logo'
import { Button } from '@renderer/components/ui/button'
import { tipcClient } from '@renderer/lib/client'
import { isWeb } from '@renderer/lib/utils'
import { useState } from 'react'

import { FieldsCardLayout, SettingViewContainer } from '../Layout'

export const AboutView = () => {
  const [checkingUpdate, setCheckingUpdate] = useState(false)
  return (
    <SettingViewContainer>
      <FieldsCardLayout className="bg-zinc-50 dark:bg-zinc-900">
        <div className="m-3 flex items-center justify-between">
          <div className="flex gap-3">
            <Logo round clasNames={{ wrapper: 'size-20 border' }} />
            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-medium">Marchen</h4>
              <div className="text-sm text-zinc-500">
                <p>当前版本: {version}</p>
                <p>Copyright @ 2024 Suemor</p>
              </div>
            </div>
          </div>
          {!isWeb && (
            <Button
              onClick={async () => {
                setCheckingUpdate(true)
                await tipcClient?.checkUpdate()
                setCheckingUpdate(false)
              }}
              disabled={checkingUpdate}
            >
              检查更新
            </Button>
          )}
        </div>
      </FieldsCardLayout>
    </SettingViewContainer>
  )
}
