import { Button } from '@paljs/ui';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { injected as connector } from 'wallet/connector';
import requests from 'requests';
import { useWeb3React } from '@web3-react/core';
import { signMessage } from 'utils/sign';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from 'requests/user';

enum LoginStatus {
  Default = 0,
  Pending,
}

export default function LoginModal() {
  const { dispatch } = useAuthContext();
  const { account, provider } = useWeb3React();
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.Default);
  const connect = async () => {
    setLoginStatus(LoginStatus.Pending);
    try {
      await connector.activate();
    } catch (error) {
      setLoginStatus(LoginStatus.Default);
    }
  };

  const handleLoginSys = async () => {
    if (!account || !provider) {
      return;
    }
    // sign
    let signData = '';
    const now = Date.now();
    try {
      signData = await provider.send('personal_sign', [signMessage(account, now), account]);
    } catch (error) {
      console.error('sign failed', error);
      setLoginStatus(LoginStatus.Default);
    }
    if (!signData) {
      return;
    }

    // login
    const res = await requests.user.login({
      wallet: account,
      timestamp: now,
      sign: signData,
    });
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
    res.data.token_exp = now + res.data.token_exp * 1000;
    dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });

    // config permission authorizer
    const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
    await authorizer.setUser(account.toLowerCase());
    dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
  };

  useEffect(() => {
    if (account && loginStatus) {
      handleLoginSys();
    }
  }, [account, loginStatus]);
  return (
    <Mask>
      <Modal>
        <Title>Connect Wallet</Title>
        <Button onClick={connect}>MetaMask</Button>
      </Modal>
    </Mask>
  );
}

const Mask = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(45, 51, 46, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 632px;
  height: 292px;
  opacity: 1;
  border-radius: 8px;
  background: #fff linear-gradient(90deg, rgba(235, 255, 255, 0.6) 0%, rgba(230, 255, 255, 0) 100%);
  padding: 60px 48px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;
