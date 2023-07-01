import { useAuthContext, AppActionType } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { injected, uniPassWallet } from 'wallet/connector';
import requests from 'requests';
import { useWeb3React } from '@web3-react/core';
import { createSiweMessage } from 'utils/sign';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from 'requests/user';
import { Wallet, WalletType } from 'wallet/wallet';
import { SELECT_WALLET } from 'utils/constant';
import { MetaMask } from '@web3-react/metamask';
import { UniPass } from '@unipasswallet/web3-react';
import { EvaIcon } from '@paljs/ui/Icon';
import useToast, { ToastType } from 'hooks/useToast';
import Image from 'next/image';
import * as gtag from 'utils/gtag';

enum LoginStatus {
  Default = 0,
  Pending,
}

type Connector = MetaMask | UniPass;

type LoginWallet = {
  name: string;
  value: Wallet;
  connector: Connector;
  iconURL: string;
  type: WalletType;
};

const LOGIN_WALLETS: LoginWallet[] = [
  {
    name: 'MetaMask',
    value: Wallet.METAMASK,
    connector: injected,
    iconURL: '/icons/metamask.png',
    type: WalletType.EOA,
  },
  {
    name: 'Unipass',
    value: Wallet.UNIPASS,
    connector: uniPassWallet,
    iconURL: '/icons/unipass.svg',
    type: WalletType.AA,
  },
];

export default function LoginModal() {
  const { dispatch } = useAuthContext();
  const { Toast, showToast } = useToast();
  const { account, provider } = useWeb3React();
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.Default);
  const [chooseWallet, setChooseWallet] = useState<LoginWallet>();

  const handleFailed = () => {
    setLoginStatus(LoginStatus.Default);
    setChooseWallet(undefined);
    localStorage.removeItem(SELECT_WALLET);
  };

  const connect = async (w: LoginWallet) => {
    setChooseWallet(w);
    const connector = w.connector;
    setLoginStatus(LoginStatus.Pending);
    try {
      await connector.activate();
      localStorage.setItem(SELECT_WALLET, w.value);
    } catch (error) {
      handleFailed();
    }
  };

  const handleLoginSys = async () => {
    if (!account || !provider || !chooseWallet) {
      return;
    }
    let newNonce: string;
    try {
      const res = await requests.user.getNonce(account);
      newNonce = res.data.nonce;
    } catch (error) {
      console.error('get nonce failed', error);
      handleFailed();

      return;
    }
    if (!newNonce) {
      return;
    }
    // sign
    let signData = '';
    const now = Date.now();
    const siweMessage = createSiweMessage(account, 1, newNonce, 'Welcome to the The Taoist Labs');
    console.log('siweMessage:', siweMessage);
    const signMsg = siweMessage.prepareMessage();

    try {
      signData = await provider.send('personal_sign', [signMsg, account]);
      console.log('signData:', signData);
    } catch (error) {
      console.error('sign failed', error);
      handleFailed();
    }
    if (!signData) {
      return;
    }
    try {
      const res = await requests.user.loginNew({
        signature: signData,
        message: signMsg,
        domain: siweMessage.domain,
        wallet: account,
        wallet_type: chooseWallet.type,
      });
      res.data.token_exp = now + res.data.token_exp * 1000;
      dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });

      // config permission authorizer
      const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
      await authorizer.setUser(account.toLowerCase());
      dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
      dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: chooseWallet.type });

      gtag.event({ action: gtag.EVENTS.LOGIN_SUCCESS, category: chooseWallet.value, value: account });
    } catch (error: any) {
      console.error(error?.data);
      const msg = error?.data?.msg || 'Login failed';
      console.error('error?.data', msg);
      gtag.event({ action: gtag.EVENTS.LOGIN_FAILED, category: chooseWallet.value, value: account });
      showToast(msg, ToastType.Danger);
      handleFailed();
    } finally {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
    }
  };

  useEffect(() => {
    if (account && loginStatus && chooseWallet) {
      handleLoginSys();
    }
  }, [account, loginStatus, chooseWallet]);

  const closeModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  return (
    <Mask>
      {Toast}
      <Modal>
        <span className="icon-close" onClick={closeModal}>
          <EvaIcon name="close-outline" />
        </span>

        <Title>Connect Wallet</Title>
        {LOGIN_WALLETS.map((w) => (
          <WalletOption key={w.value} onClick={() => connect(w)}>
            <span>{w.name}</span>
            <span>
              <Image src={w.iconURL} alt="" width="28px" height="28px" />
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
  height: 300px;
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

const Loading = styled.div`
  width: 100px;
  height: 100px;
`;
