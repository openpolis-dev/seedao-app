import React, { useEffect, useRef, useState } from 'react';
import * as user from 'requests/user';

// import { useWeb3React } from '@web3-react/core';
import useCheckLogin from 'hooks/useCheckLogin';
import { useAuthContext } from 'providers/authProvider';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// import { useRouter } from 'next/router';
// import Script from 'next/script';
import { ContainerPadding } from 'assets/styles/global';

const Box = styled.div`
  height: 100%;
  ${ContainerPadding};
`;

export default function Index() {
  const navigate = useNavigate();
  const {
    state: { userData, account, provider },
  } = useAuthContext();
  const isLogin = useCheckLogin(account);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    window.seeDAOosApi = {
      getUsers: user.getUsers,
    };
    const init = (window.chatWidgetApi as any).init;
    (window.chatWidgetApi as any).init = (baseUri: string) => {
      init(baseUri);
      setStatus(true);
    };
  }, []);

  const signerMsg = async ({ message }: { message: string }) => {
    if (!provider || !account) {
      return '';
    }
    // const signData = await provider.send('personal_sign', [message, account]);
    const signData = await provider.signMessage(message);
    return signData as string;
  };
  const loginCallback = (r: any) => {
    console.log('loginCallback: ', r);
  };

  const handleLogin = async () => {
    if (!account || !provider) {
      return;
    }
    window.chatWidgetApi.thirdDIDLogin(account, signerMsg, loginCallback);
  };

  useEffect(() => {
    if (!status) return;
    isLogin && handleLogin();
  }, [isLogin, status]);

  useEffect(() => {
    if (!userData && window?.chatWidgetApi) {
      navigate('/proposal');
    }
  }, [userData]);

  return (
    <Box>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <chat-component
        baseUrl="https://sdktest.sending.me"
        useThirdLogin={true}
        widgetWidth="100%"
        widgetHeight="80vh"
        colorPrimary500="#BFEF2D"
        colorPrimary400="#C9FB30"
        colorPrimaryTransparent100="rgba(195, 242, 55, 0.25)"
        colorPrimaryTransparent200="rgba(195, 242, 55, 0.15)"
        colorPrimaryTransparent300="rgba(195, 242, 55, 0.08)"
      />
    </Box>
  );
}
