import AuthProvider from './providers/authProvider';
import './assets/styles/quill.css';
import './assets/styles/font.css';
import './assets/styles/custom.scss';
import RouterLink from './router';
import GlobalStyle from 'assets/styles/global';
import 'md-editor-rt/lib/style.css';
import ErrorBoundary from 'components/ErrorBoundary';
import WagmiProvider from 'providers/wagmiProvider';

function App() {
  return (
    <ErrorBoundary>
      <WagmiProvider>
        <AuthProvider>
          <GlobalStyle />
          <RouterLink />
        </AuthProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}

export default App;
