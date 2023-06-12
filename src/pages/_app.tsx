import { AppProps } from 'next/app';
import Web3Provider from 'providers/web3Provider';
import AuthProvider from 'providers/authProvider';

interface CustomPageProps {}

export default function App({ Component, pageProps }: AppProps<CustomPageProps>) {
  return (
    <AuthProvider>
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </AuthProvider>
  );
}
