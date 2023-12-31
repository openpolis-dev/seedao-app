import AuthProvider from './providers/authProvider';
import './assets/styles/quill.css';
import './assets/styles/font.css';
import './assets/styles/custom.scss';
import RouterLink from './router';
import GlobalStyle from 'assets/styles/global';
import 'md-editor-rt/lib/style.css';
import { DeSchoolProvider, CourseContextProvider } from '@deschool-protocol/react';
import '@deschool-protocol/react/dist/styles/index.css';
import ErrorBoundary from 'components/ErrorBoundary';
import WagmiProvider from 'providers/wagmiProvider';

function App() {
  const { search } = window.location;
  const dtoken = new URLSearchParams(search).get('dtoken') || '';

  return (
    <ErrorBoundary>
      <WagmiProvider>
        <AuthProvider>
          <GlobalStyle />
          <DeSchoolProvider
            config={{
              baseUrl: 'https://deschool.app/goapiProduction',
              token: dtoken,
            }}
          >
            <CourseContextProvider>
              <RouterLink />
            </CourseContextProvider>
          </DeSchoolProvider>
        </AuthProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}

export default App;
