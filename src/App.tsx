import Web3Provider from './providers/web3Provider';
import AuthProvider from './providers/authProvider';
import './assets/styles/quill.css';
import './assets/styles/font.css';
import './assets/styles/custom.scss';
import RouterLink from './router';
import GlobalStyle from 'assets/styles/global';
// import InstallCheck from 'components/installPWA';

// import 'bootstrap/dist/css/bootstrap.min.css';
import { onMessageListener } from './components/firebase';
import { useEffect } from 'react';

function App() {
  onMessageListener()
    .then((payload) => {
      console.log('onMessageListener', payload);
    })
    .catch((err) => console.log('failed: ', err));

  useEffect(() => {
    navigator.serviceWorker
      .register('firebase-messaging-sw.js')
      .then(() => {
        console.log('sucess ----- ');
      })
      .catch((err) => {
        console.error('error ----- ', err);
      });
  }, []);
  return (
    <AuthProvider>
      <Web3Provider>
        <GlobalStyle />
        <RouterLink />
        {/* <InstallCheck /> */}
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
