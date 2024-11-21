import { notarize } from '@electron/notarize'

export default async function notarizing(context) {
  if (context.electronPlatformName !== 'darwin') {
    return
  }

  const appBundleId = process.env.APPLE_APP_BUNDLE_ID
  const appleId = process.env.APPLE_ID
  const appleIdPassword = process.env.APPLE_ID_PASSWORD
  const ascProvider = process.env.APPLE_ASC_PROVIDER
  const teamId = process.env.APPLE_TEAM_ID
  // eslint-disable-next-line no-console
  console.log(appBundleId, '=======')
  if (!appBundleId || !appleId || !appleIdPassword || !ascProvider || !teamId) {
    return
  }

  const appName = context.packager.appInfo.productFilename
  const appPath = `${context.appOutDir}/${appName}.app`
  // eslint-disable-next-line no-console
  console.log('Notarizing app:', appPath)

  await notarize({
    appBundleId,
    appPath,
    appleId,
    appleIdPassword,
    ascProvider,
    tool: 'notarytool',
    teamId,
  })
}
