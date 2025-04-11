import AuthProvider from './providers/authProvider';
import './assets/styles/quill.css';
import './assets/styles/font.css';
import './assets/styles/custom.scss';
import RouterLink from './router';
import GlobalStyle from 'assets/styles/global';
import 'md-editor-rt/lib/style.css';
import ErrorBoundary from 'components/ErrorBoundary';
import WagmiProvider from 'providers/wagmiProvider';
import { initDB } from "react-indexed-db-hook";
import { DBConfig } from "./utils/DBconfig";
initDB(DBConfig);

function App() {
  return (
    <ErrorBoundary>
      <WagmiProvider>
        {/* TODO: AuthProvider -- fix name to AppProvider */}
        <AuthProvider>
          <GlobalStyle />
          <RouterLink />
        </AuthProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}

export default App;
