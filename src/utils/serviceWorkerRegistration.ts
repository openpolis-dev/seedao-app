import { registerDevice, getPushDevice } from 'requests/push';

const version = 'v1.0.4';

export function register(config?: any) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {});
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

export async function unregister(callback?: any) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(async function (registrations) {
      for (let registration of registrations) {
        console.log('registration:', registration, registration.active?.scriptURL);
        if (registration.active?.scriptURL.includes('sw.js')) {
          console.log('>> start to remove old service worker');
          await registration.unregister();
          console.log('>> removed old service worker');
        }
      }
      callback && callback();
    });
  }
}
