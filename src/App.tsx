// import Web3Provider from './providers/web3Provider';
import AuthProvider from './providers/authProvider';
import './assets/styles/quill.css';
import './assets/styles/font.css';
import './assets/styles/custom.scss';
import RouterLink from './router';
import GlobalStyle from 'assets/styles/global';
// import InstallCheck from 'components/installPWA';

// import 'bootstrap/dist/css/bootstrap.min.css';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useEffect } from 'react';
import runOneSignal from 'utils/onesignal';
import { unregister } from 'utils/serviceWorkerRegistration';

const chains = [mainnet];

const projectId = 'da76ddd6c7d31632ed7fc9b88e28a410';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  useEffect(() => {
    unregister(runOneSignal);
  }, []);

  return (
    // <Web3Provider>

    <WagmiConfig config={wagmiConfig}>
      <AuthProvider>
        <GlobalStyle />
        <RouterLink />
        {/* <InstallCheck /> */}

        <Web3Modal
          defaultChain={mainnet}
          projectId={projectId}
          ethereumClient={ethereumClient}
          explorerRecommendedWalletIds={[
            'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
            // '80c7742837ad9455049270303bccd55bae39a9e639b70d931191269d3a76320a',
            // '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0'
          ]}
          explorerExcludedWalletIds="ALL"
        />
      </AuthProvider>
    </WagmiConfig>
    // </Web3Provider>
  );
}

export default App;
