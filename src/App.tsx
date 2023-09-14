import Web3Provider from './providers/web3Provider';
import AuthProvider from './providers/authProvider';
import './assets/styles/quill.css';
import './assets/styles/font.css';
import './assets/styles/custom.scss';
import RouterLink from './router';
import GlobalStyle from 'assets/styles/global';

// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <GlobalStyle />
        <RouterLink />
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
