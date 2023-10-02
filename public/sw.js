// install
self.addEventListener("install", (event) => {
  console.log("installing…");
});

// activate
self.addEventListener("activate", (event) => {
  console.log("now ready to handle fetches!");
});

// fetch
self.addEventListener("fetch", (event) => {
  console.log("now fetch!");
});

self.addEventListener("push", function (event) {
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  const payload = event.data ? event.data.text() : "no payload";
  const data = JSON.parse(payload);
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    self.registration.showNotification(data.title || "notifycation title", {
      ...data.data,
    })
  );
});

self.addEventListener("notificationclick", async function (event) {
  console.log("click event:", event);
  console.log("notificationt:", event.notification);
  if (event.notification.data) {
    // const client_arr = await clients.matchAll({
    //   type: "window",
    // });
    // console.log("client_arr:", client_arr);
    // if (client_arr.length > 0) {
    //   client_arr[0].postMessage("New chat messages!");
    // } else {
    //   clients.openWindow(event.notification.data);
    // }
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
