import Web3Provider from './providers/web3Provider';
import AuthProvider from './providers/authProvider';
import './assets/styles/quill.css';
import './assets/styles/font.css';
import './assets/styles/custom.scss';
import RouterLink from './router';
import GlobalStyle from 'assets/styles/global';
// import InstallCheck from 'components/installPWA';

// import 'bootstrap/dist/css/bootstrap.min.css';
import useMedia from 'hooks/useMedia';
import { isPad } from 'utils/userAgent';
import { useEffect } from 'react';

function App() {
  const isLargeScreen = useMedia('(min-width: 768px)', true);

  useEffect(() => {
    console.log('[isLargeScreen]', isLargeScreen);
    console.log('[isPad]', isPad);
    if (!isPad && !isLargeScreen) {
      const mobile_app = process.env.REACT_APP_MOBILE_URL;
      mobile_app && window.location.replace('https://dev-m.seedao.tech/');
    }
  }, [isPad, isLargeScreen]);

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
