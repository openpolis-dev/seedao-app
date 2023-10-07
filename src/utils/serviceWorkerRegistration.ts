import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, isSupported } from 'firebase/messaging';
import { registerDevice, getPushDevice } from 'requests/push';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCuXK4qOcVPZHwen8YJ_xiBNYzM5K8VgtY',
  authDomain: 'test-pwa-12448.firebaseapp.com',
  databaseURL: 'https://test-pwa-12448-default-rtdb.firebaseio.com',
  projectId: 'test-pwa-12448',
  storageBucket: 'test-pwa-12448.appspot.com',
  messagingSenderId: '134621359161',
  appId: '1:134621359161:web:5ef9ef4afa8e3aafcb71e8',
};

let messaging: Messaging;

const version = 'v1';

export function register(config?: any) {
  if ('serviceWorker' in navigator) {
    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);

    window.addEventListener('load', () => {
      registerValidSW('/firebase-messaging-sw.js', config);
    });
  }
}

function registerValidSW(swUrl: string, config?: any) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      if (localStorage.getItem('sw_version') !== version) {
        registration.update().then(function () {
          localStorage.setItem('sw_version', version);
        });
      }
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        console.log('installingWorker:', installingWorker);
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.',
              );

              // Execute callback
              if (config?.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');
              // Execute callback
              if (config?.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

export const getPushToken = async () => {
  try {
    await navigator.serviceWorker.ready;
    const supported = await isSupported();
    if (!supported) {
      throw new Error('NOTIFICATIONS_NOT_SUPPORTED');
    }
    const token = await getToken(messaging);
    if (token) {
      console.log('current token for client: ', token);
      return token;
    } else {
      throw new Error('No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
    throw new Error('An error occurred while retrieving token.');
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export const registerPush = async () => {
  try {
    // register push
    const deviceToken = await getPushToken();
    if (deviceToken) {
      await registerDevice({
        device: getPushDevice(),
        registration_token: deviceToken,
        language: localStorage.getItem('language') || 'en',
      });
    }
  } catch (error) {
    console.error(error);
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      try {
        // register push
        const deviceToken = await getPushToken();
        if (deviceToken) {
          await registerDevice({
            device: getPushDevice(),
            registration_token: deviceToken,
            language: localStorage.getItem('language') || 'en',
          });
        }
      } catch (error) {
        console.error('dev second failed', error);
      }
    }
  }
};
