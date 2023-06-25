import { useAuthContext, AppActionType } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { injected, uniPassWallet } from 'wallet/connector';
import requests from 'requests';
import { useWeb3React } from '@web3-react/core';
import { signMessage } from 'utils/sign';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from 'requests/user';
import { Wallet } from 'wallet/wallet';
import { SELECT_WALLET } from 'utils/constant';
import { MetaMask } from '@web3-react/metamask';
import { UniPass } from '@unipasswallet/web3-react';
import { EvaIcon } from '@paljs/ui/Icon';

enum LoginStatus {
  Default = 0,
  Pending,
}

type Connector = MetaMask | UniPass;

const LOGIN_WALLETS = [
  {
    name: 'MetaMask',
    value: Wallet.METAMASK,
    connector: injected,
    iconURL: '/icons/metamask.png',
  },
  {
    name: 'Unipass',
    value: Wallet.UNIPASS,
    connector: uniPassWallet,
    iconURL: '/icons/unipass.svg',
  },
];

export default function LoginModal() {
  const { dispatch } = useAuthContext();
  const { account, provider } = useWeb3React();
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.Default);

  const connect = async (w: { value: Wallet; connector: Connector }) => {
    const connector = w.connector;
    setLoginStatus(LoginStatus.Pending);
    try {
      await connector.activate();
      localStorage.setItem(SELECT_WALLET, w.value);
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

  const closeModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  return (
    <Mask>
      <Modal>
        <span className="icon-close" onClick={closeModal}>
          <EvaIcon name="close-outline" />
        </span>

        <Title>Connect Wallet</Title>
        {LOGIN_WALLETS.map((w) => (
          <WalletOption key={w.value} onClick={() => connect(w)}>
            <span>{w.name}</span>
            <span>
              <img src={w.iconURL} alt="" />
            </span>
          </WalletOption>
        ))}
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
  width: 400px;
  opacity: 1;
  border-radius: 8px;
  background: #fff linear-gradient(90deg, rgba(235, 255, 255, 0.6) 0%, rgba(230, 255, 255, 0) 100%);
  padding: 40px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
`;

const WalletOption = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    padding: 10px 28px;
    border-radius: 8px;
    margin-block: 10px;
    cursor: pointer;
    background: ${theme.colorPrimary100};
    &:hover {
      background-color: #ddd;
    }
    img {
      width: 28px;
      height: 28px;
    }
  `}
`;
