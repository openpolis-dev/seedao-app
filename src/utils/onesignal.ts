import OneSignal from 'react-onesignal';
import getConfig from './envCofnig';
export default async function runOneSignal() {
  const app_id = getConfig().REAT_APP_ONESIGNAL_ID;
  console.log('app_id:', app_id);
  await OneSignal.init({ appId: app_id, serviceWorkerUpdaterPath: '/OneSignalSDKWorker.js' });
  OneSignal.Slidedown.promptPush();
}
