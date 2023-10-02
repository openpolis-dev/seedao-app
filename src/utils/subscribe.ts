import { registerDevice } from 'requests/push';

async function subscribeToPushMessages(wallet: string) {
  if (!window.navigator || !navigator.serviceWorker) {
    console.error('not support navigator or serviceWorker');
    return;
  }

  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  let pushSubscription: PushSubscription;

  try {
    // Subscribe the user to push notifications
    pushSubscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.WEB_PUSH_PUBLIC_KEY || ''),
    });
    const subscription = await pushSubscription;
    const data = subscription.toJSON();
    console.log('===== sub =====');
    console.log(JSON.stringify(data));
    console.log('===============');
    // TODO handle device
    await registerDevice({ wallet, device: 'pc', push_subscription: data });
    return data;
  } catch (err) {
    // The subscription wasn't successful.
    console.log('Error', err);
  }
}

// Utility function for browser interoperability
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default subscribeToPushMessages;
