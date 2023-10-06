// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyCuXK4qOcVPZHwen8YJ_xiBNYzM5K8VgtY',
  authDomain: 'test-pwa-12448.firebaseapp.com',
  databaseURL: 'https://test-pwa-12448-default-rtdb.firebaseio.com',
  projectId: 'test-pwa-12448',
  storageBucket: 'test-pwa-12448.appspot.com',
  messagingSenderId: '134621359161',
  appId: '1:134621359161:web:5ef9ef4afa8e3aafcb71e8',
  measurementId: 'G-N4B2RPB1GJ',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

const MESSAGE_TYPE = {
  PROJECT_ADD: 'proj_staff_add',
  PROJECT_REMOVE: 'proj_staff_remove',
  GUILD_ADD: 'guid_staff_add',
  GUILD_REMOVE: 'guild_staff_remove',
  ASSET_NEW: 'receive_assert',
};

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const { type } = payload.data;

  let route_path = '';
  switch (type) {
    case MESSAGE_TYPE.PROJECT_ADD:
    case MESSAGE_TYPE.PROJECT_REMOVE:
      route_path = `/project/${payload.data.project_id}`;
      break;
    case MESSAGE_TYPE.GUILD_ADD:
    case MESSAGE_TYPE.GUILD_REMOVE:
      route_path = `/guild/${payload.data.guild_id}`;
      break;
    case MESSAGE_TYPE.ASSET_NEW:
      route_path = '/user/vault';
      break;
    default:
      break;
  }
  console.log('payload: ', payload);
  console.log('route_path: ', route_path);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    data: route_path,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', async function (event) {
  console.log('click event:', event);
  console.log('notificationt:', event.notification);
  if (event.notification.data) {
    const promise = new Promise(function (resolve) {
      setTimeout(resolve, 800);
    }).then(function () {
      // return the promise returned by openWindow, just in case.
      // Opening any origin only works in Chrome 43+.
      return clients.openWindow(event.notification.data);
    });
    event.waitUntil(promise);
  }
});
