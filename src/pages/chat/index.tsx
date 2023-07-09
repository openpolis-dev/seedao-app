import React, { useEffect } from 'react';
import * as user from 'requests/user';

import Layout from 'Layouts';
import { useWeb3React } from '@web3-react/core';
import useCheckLogin from 'hooks/useCheckLogin';
import { useAuthContext } from 'providers/authProvider';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  const { account, provider } = useWeb3React();
  const isLogin = useCheckLogin();
  const {
    state: { userData },
  } = useAuthContext();

  useEffect(() => {
    window.seeDAOosApi = {
      getUsers: user.getUsers,
    };
  }, []);

  const signer = async ({ message }: { message: string }) => {
    if (!provider || !account) {
      return '';
    }
    const signData = await provider.send('personal_sign', [message, account]);
    return signData as string;
  };

  const loginCallback = (r: any) => {
    console.log('loginCallback: ', r);
  };

  const handleLogin = () => {
    if (!account) {
      return;
    }
    window.chatWidgetApi.thirdDIDLogin(account, signer, loginCallback);
  };

  useEffect(() => {
    isLogin && window && window.chatWidgetApi && handleLogin();
  }, [isLogin]);

  useEffect(() => {
    if (!userData && window?.chatWidgetApi) {
      router.push('/proposal');
    }
  }, [userData]);

  return (
    <Layout title="SeeDAO Chat">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <chat-component
        baseUrl="https://sdktest.sending.me"
        useThirdLogin={true}
        widgetWidth="100%"
        widgetHeight="600px"
        colorPrimary500="#BFEF2D"
        colorPrimary400="#C9FB30"
        colorPrimaryTransparent100="rgba(195, 242, 55, 0.25)"
        colorPrimaryTransparent200="rgba(195, 242, 55, 0.15)"
        colorPrimaryTransparent300="rgba(195, 242, 55, 0.08)"
      />
    </Layout>
  );
}
