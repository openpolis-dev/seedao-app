import { AppProps } from 'next/app';
import Web3Provider from 'providers/web3Provider';
import AuthProvider from 'providers/authProvider';
import GlobalStyle from '../utils/GloablStyle';

interface CustomPageProps {}

export default function App({ Component, pageProps }: AppProps<CustomPageProps>) {
  const AnyComponent = Component as any;
  const MyGlobalStyle = GlobalStyle as any;
  return (
    <AuthProvider>
      <Web3Provider>
        <AnyComponent {...pageProps} />
      </Web3Provider>
      <MyGlobalStyle />
    </AuthProvider>
  );
}
