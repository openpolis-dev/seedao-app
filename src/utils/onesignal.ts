import OneSignal from 'react-onesignal';
import getConfig from './envCofnig';
export default async function runOneSignal() {
  await OneSignal.init({ appId: getConfig().REAT_APP_ONESIGNAL_ID });
  OneSignal.Slidedown.promptPush();
}
