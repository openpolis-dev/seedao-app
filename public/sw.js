const MESSAGE_TYPE = {
  PROJECT_ADD: 'proj_staff_add',
  PROJECT_REMOVE: 'proj_staff_remove',
  GUILD_ADD: 'guid_staff_add',
  GUILD_REMOVE: 'guild_staff_remove',
  ASSET_NEW: 'receive_assert',
};
// install
self.addEventListener('install', (event) => {
  console.log('installing…');
});

// activate
self.addEventListener('activate', (event) => {
  console.log('now ready to handle fetches!');
});

// fetch
self.addEventListener('fetch', (event) => {
  console.log('now fetch!');
});

self.addEventListener('push', async function (event) {
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  console.log('event: ', event);

  const json_string = event.data ? event.data.text() : '{}';
  const payload = JSON.parse(json_string);

  const { data, type } = payload.payload;
  let route_path = '';
  switch (type) {
    case MESSAGE_TYPE.PROJECT_ADD:
    case MESSAGE_TYPE.PROJECT_REMOVE:
      route_path = `/project/${data.project_id}`;
      break;
    case MESSAGE_TYPE.GUILD_ADD:
    case MESSAGE_TYPE.GUILD_REMOVE:
      route_path = `/guild/${data.project_id}`;
      break;
    case MESSAGE_TYPE.ASSET_NEW:
      route_path = '/user/vault';
      break;
    default:
      break;
  }
  console.log("payload: ", payload);
  console.log('route_path: ', route_path);

  event.waitUntil(
    self.registration.showNotification(payload.title || 'notifycation title', {
      body: payload.body,
      data: route_path,
    }),
  );

  // const payload = event.data ? event.data.text() : "no payload";
  // const data = JSON.parse(payload);
  // // Keep the service worker alive until the notification is created.
  // event.waitUntil(
  //   self.registration.showNotification(data.title || "notifycation title", {
  //     ...data.data,
  //   })
  // );
});

self.addEventListener('notificationclick', async function (event) {
  console.log('click event:', event);
  console.log('notificationt:', event.notification);
  if (event.notification.data) {
    const promise = new Promise(function (resolve) {
      setTimeout(resolve, 1000);
    }).then(function () {
      // return the promise returned by openWindow, just in case.
      // Opening any origin only works in Chrome 43+.
      return clients.openWindow(event.notification.data);
    });
    event.waitUntil(promise);
  }
});
