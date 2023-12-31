import React, { useEffect, useState } from 'react';
import * as user from 'requests/user';

import useCheckLogin from 'hooks/useCheckLogin';
import { useAuthContext } from 'providers/authProvider';
import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import { useSignMessage, useAccount } from 'wagmi';

const Box = styled.div`
  height: 100%;
  ${ContainerPadding};
  width: 430px;
  margin: 0 auto;
`;

export default function Index() {
  const { signMessageAsync } = useSignMessage();
  const { isConnected, address } = useAccount();

  const {
    state: { account },
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
    return await signMessageAsync({ message });
  };
  const loginCallback = (r: any) => {
    console.log('loginCallback: ', r);
  };

  const handleLogin = async () => {
    if (!account || !isConnected || !address) {
      return;
    }
    window.chatWidgetApi.thirdDIDLogin(account, signerMsg, loginCallback);
  };

  useEffect(() => {
    if (!status) return;
    isLogin && handleLogin();
  }, [isLogin, status]);

  // useEffect(() => {
  //   if (!userData && window?.chatWidgetApi) {
  //     navigate('/proposal');
  //   }
  // }, [userData]);

  return (
    <>
      {isConnected && address && account && (
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
      )}
    </>
  );
}
