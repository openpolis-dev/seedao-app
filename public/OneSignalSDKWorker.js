importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

console.log('service worker registed');

self.addEventListener('install', (event) => {
  console.log('service worker installed');
  event.waitUntil(self.skipWaiting());
});

const MESSAGE_TYPE = {
  PROJECT_ADD: 'proj_staff_add',
  PROJECT_REMOVE: 'proj_staff_remove',
  GUILD_ADD: 'guild_staff_add',
  GUILD_REMOVE: 'guild_staff_remove',
  ASSET_NEW: 'receive_assert',
  CUSTOM: 'custom',
};

self.addEventListener('notificationclick', async function (event) {
  console.log('-- click event:', event);
  console.log('-- notificationt:', event.notification);
  const data = event.notification.data?.additionalData;

  if (data) {
    const type = data.type;
    let route_path = '/';
    switch (type) {
      case MESSAGE_TYPE.PROJECT_ADD:
      case MESSAGE_TYPE.PROJECT_REMOVE:
        route_path = `/project/info/${data.proj_id}`;
        break;
      case MESSAGE_TYPE.GUILD_ADD:
      case MESSAGE_TYPE.GUILD_REMOVE:
        route_path = `/guild/info/${data.guild_id}`;
        break;
      case MESSAGE_TYPE.ASSET_NEW:
        route_path = '/user/vault';
        break;
      case MESSAGE_TYPE.CUSTOM:
        if (data.jump_url) {
          route_path = data.jump_url;
        }
        break;
      default:
        break;
    }
    const promise = new Promise(function (resolve) {
      setTimeout(resolve, 800);
    }).then(function () {
      // return the promise returned by openWindow, just in case.
      // Opening any origin only works in Chrome 43+.
      return clients.openWindow(route_path);
    });
    event.waitUntil(promise);
  }
});