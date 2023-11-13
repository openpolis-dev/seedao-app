import OneSignal from 'react-onesignal';
import getConfig from './envCofnig';

export default function runOneSignal() {
  const app_id = getConfig().REACT_APP_ONESIGNAL_ID;
  console.log('app_id:', app_id);
  try {
    OneSignal.init({ appId: app_id });
    OneSignal.Slidedown.promptPush();
  } catch (error) {
    console.error('init onesignal error:', error);
  }
}
