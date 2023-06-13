import { AppProps } from 'next/app';
import Web3Provider from 'providers/web3Provider';
import AuthProvider from 'providers/authProvider';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CustomPageProps {}

export default function App({ Component, pageProps }: AppProps<CustomPageProps>) {
  const AnyComponent = Component as any;

  return (
    <AuthProvider>
      <Web3Provider>
        <AnyComponent {...pageProps} />
      </Web3Provider>
    </AuthProvider>
  );
}
