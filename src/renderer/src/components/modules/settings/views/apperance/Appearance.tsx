import { FieldLayout, FieldsCardLayout, SettingViewContainer } from '../Layout'
import { DarkModeToggle } from './DarkMode'

export const AppearanceView = () => {
  return (
    <SettingViewContainer>
      <FieldsCardLayout title="一般">
        <FieldLayout title="主题">
          <DarkModeToggle />
        </FieldLayout>
      </FieldsCardLayout>
    </SettingViewContainer>
  )
}
