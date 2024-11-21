import { notarize } from '@electron/notarize'
import { config } from 'dotenv'

config()

export default async function notarizing(context) {
  if (context.electronPlatformName !== 'darwin') {
    return
  }

  const appBundleId = process.env.APPLE_APP_BUNDLE_ID
  const appleId = process.env.APPLE_ID
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD
  const teamId = process.env.APPLE_TEAM_ID
  // eslint-disable-next-line prefer-template, no-console
  console.log(appBundleId + '======', appBundleId[2], '=======')
  if (!appBundleId || !appleId || !appleIdPassword || !teamId) {
    return
  }

  const appName = context.packager.appInfo.productFilename
  const appPath = `${context.appOutDir}/${appName}.app`
  // eslint-disable-next-line no-console
  console.log('Notarizing app:', appPath)

  await notarize({
    appPath,
    appBundleId,
    appleId,
    appleIdPassword,
    teamId,
  })
}
