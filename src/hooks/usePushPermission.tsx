import { useState, useEffect, useMemo } from 'react';
import { getPushToken } from 'components/firebase';

const askPermission = () => {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error("We weren't granted permission.");
    }
  });
};

export default function usePushPermission() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (!window.Notification) {
      console.error('not support navigator');
      return;
    }

    // const handlePermission = (permission: string) => {
    //   setPermission(permission);
    // };

    // Notification.requestPermission()
    //   .then(handlePermission)
    //   .catch((err) => console.error('permission failed', err));
  }, []);

  const handlePermission = () => {
    // return askPermission()
    //   .then((res) => {
    //     console.log('you agreed permission');
    //     setPermission('granted');
    //   })
    //   .catch((err) => {
    //     console.error('you denied permission');
    //   });
    return getPushToken().then(() => {
      setPermission('granted');
    });
  };

  const hasGranted = useMemo(() => permission === 'granted', [permission]);

  return { handlePermission, hasGranted };
}
