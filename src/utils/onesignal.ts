import OneSignal from 'react-onesignal';

export default async function runOneSignal() {
  await OneSignal.init({ appId: '9c6122e1-3de4-4c03-8e68-9f357e9ca1ae' });
  //   await OneSignal.init({ appId: '135980e7-6778-4bf8-9aac-dabc7fbd8e31' });
  OneSignal.Slidedown.promptPush();
}
