self.addEventListener('notificationclick', async function (event) {
  console.log('click event:', event);
  console.log('notificationt:', event.notification);
  const data = event.notification.data?.FCM_MSG?.data;

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

// Scripts for firebase and firebase messaging
importScripts('firebase-env.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

const MESSAGE_TYPE = {
  PROJECT_ADD: 'proj_staff_add',
  PROJECT_REMOVE: 'proj_staff_remove',
  GUILD_ADD: 'guild_staff_add',
  GUILD_REMOVE: 'guild_staff_remove',
  ASSET_NEW: 'receive_assert',
  CUSTOM: 'custom',
};

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);
});
