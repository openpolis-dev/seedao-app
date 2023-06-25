import { AppProps } from 'next/app';
import Web3Provider from 'providers/web3Provider';
import AuthProvider from 'providers/authProvider';
import React from 'react';
import 'styles/quill.css';
import Script from 'next/script';
import { useRouter } from 'next/router';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CustomPageProps {}

export default function App({ Component, pageProps }: AppProps<CustomPageProps>) {
  const AnyComponent = Component as any;
  const router = useRouter();
  console.log('router:', router);
  console.log('basePath:', router.basePath);

  return (
    <>
      <Script src={`${router.basePath}/sdnChatWidget.js`} type="text/javascript" />
      <AuthProvider>
        <Web3Provider>
          <AnyComponent {...pageProps} />
        </Web3Provider>
      </AuthProvider>
    </>
  );
}
