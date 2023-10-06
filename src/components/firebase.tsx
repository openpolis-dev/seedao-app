// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
initializeApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getPushToken = async () => {
  try {
    const token = await getToken(messaging);
    if (token) {
      console.log('current token for client: ', token);
      return token;
    } else {
      throw new Error('No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
