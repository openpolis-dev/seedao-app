import OneSignal from 'react-onesignal';
import getConfig from './envCofnig';

const VERSION = '';

export default function runOneSignal() {
  const app_id = getConfig().REAT_APP_ONESIGNAL_ID;
  console.log('app_id:', app_id);
  try {
    const _version_query = VERSION ? `?v=${VERSION}` : '';
    OneSignal.init({ appId: app_id, serviceWorkerPath: `/OneSignalSDKWorker.js${_version_query}` });
    OneSignal.Slidedown.promptPush();
  } catch (error) {
    console.error('init onesignal error:', error);
  }
}
