import { AppProps } from 'next/app';
import Web3Provider from 'providers/web3Provider';
import AuthProvider from 'providers/authProvider';
import React, { useEffect } from 'react';
import 'styles/quill.css';
import 'styles/font.css';
import Script from 'next/script';
import { useRouter } from 'next/router';
import * as gtag from 'utils/gtag';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CustomPageProps {}

export default function App({ Component, pageProps }: AppProps<CustomPageProps>) {
  const AnyComponent = Component as any;
  const router = useRouter();
  console.log('router:', router);
  console.log('basePath:', router.basePath);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        `,
        }}
      ></Script>
      <Script src={`${router.basePath}/sdnChatWidget.js`} type="text/javascript" />
      <AuthProvider>
        <Web3Provider>
          <AnyComponent {...pageProps} />
        </Web3Provider>
      </AuthProvider>
    </>
  );
}
