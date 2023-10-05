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

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
