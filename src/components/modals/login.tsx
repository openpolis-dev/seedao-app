import { useAuthContext, AppActionType } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { injected, uniPassWallet, uniPassHooks } from 'wallet/connector';
import requests from 'requests';
import { useWeb3React } from '@web3-react/core';
import { createSiweMessage } from 'utils/sign';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from 'requests/user';
import { Wallet, WalletType } from 'wallet/wallet';
import { SELECT_WALLET } from 'utils/constant';
import { MetaMask } from '@web3-react/metamask';
import { UniPass } from '@unipasswallet/web3-react';
import useToast, { ToastType } from 'hooks/useToast';
import * as gtag from 'utils/gtag';
import { useTranslation } from 'react-i18next';
import { Web3Provider } from '@ethersproject/providers';
import { X } from 'react-bootstrap-icons';

const { useProvider, useAccount } = uniPassHooks;

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
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { Toast, showToast } = useToast();
  const { account, provider } = useWeb3React();
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.Default);
  const [chooseWallet, setChooseWallet] = useState<LoginWallet>();

  const _uprovider = useProvider();
  const _account = useAccount();

  const handleFailed = () => {
    setLoginStatus(LoginStatus.Default);
    setChooseWallet(undefined);
    localStorage.removeItem(SELECT_WALLET);
  };

  const connect = async (w: LoginWallet) => {
    if (w.value === Wallet.METAMASK && !window.ethereum) {
      window.open('https://metamask.io/download.html', '_blank');
      return;
    }
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

  const handleLoginSys = async (_account: string, _provider: Web3Provider) => {
    if (!_account || !_provider || !chooseWallet) {
      return;
    }
    let newNonce: string;
    try {
      const res = await requests.user.getNonce(_account);
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
    const siweMessage = createSiweMessage(_account, 1, newNonce, 'Welcome to SeeDAO!');
    console.log('siweMessage:', siweMessage);
    const signMsg = siweMessage.prepareMessage();

    try {
      signData = await _provider.send('personal_sign', [signMsg, _account]);
      console.log('signData:', signData);
    } catch (error) {
      console.error('sign failed', error);
      handleFailed();
    }
    if (!signData) {
      return;
    }
    try {
      const res = await requests.user.login({
        signature: signData,
        message: signMsg,
        domain: siweMessage.domain,
        wallet: _account,
        wallet_type: chooseWallet.type,
        is_eip191_prefix: true,
      });
      res.data.token_exp = now + res.data.token_exp * 1000;
      dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });

      // config permission authorizer
      const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
      await authorizer.setUser(_account.toLowerCase());
      dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
      dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: chooseWallet.type });

      // gtag.event({ action: gtag.EVENTS.LOGIN_SUCCESS, category: chooseWallet.value, value: account });
    } catch (error: any) {
      console.error(error?.data);
      const msg = error?.data?.msg || 'Login failed';
      console.error('error?.data', msg);
      // gtag.event({ action: gtag.EVENTS.LOGIN_FAILED, category: chooseWallet.value, value: account });
      showToast(msg, ToastType.Danger);
      handleFailed();
    } finally {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
    }
  };

  useEffect(() => {
    if (chooseWallet?.value !== Wallet.METAMASK || provider?.connection?.url !== 'metamask') {
      return;
    }
    if (account && loginStatus && provider) {
      handleLoginSys(account, provider);
    }
  }, [account, loginStatus, chooseWallet, provider]);

  useEffect(() => {
    if (chooseWallet?.value !== Wallet.UNIPASS || _uprovider?.connection?.url === 'metamask') {
      return;
    }
    if (_account && loginStatus && _uprovider) {
      handleLoginSys(_account, _uprovider);
    }
  }, [_account, _uprovider, loginStatus, chooseWallet]);

  const closeModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  return (
    <Mask>
      {Toast}
      <Modal>
        <span className="icon-close" onClick={closeModal}>
          {/*<EvaIcon name="close-outline" />*/}
          <X />
        </span>

        <Title>{t('general.ConnectWallet')}</Title>
        <Content>
          {LOGIN_WALLETS.map((w) => (
            <WalletOption key={w.value} onClick={() => connect(w)}>
              <span>{w.name}</span>
              <span>
                <img src={w.iconURL} alt="" width="28px" height="28px" />
              </span>
            </WalletOption>
          ))}
        </Content>
      </Modal>
    </Mask>
  );
}

const Mask = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
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

const WalletOption = styled.li`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    padding: 10px 28px;
    border-radius: 8px;
    margin-block: 10px;
    cursor: pointer;
    //background: ${theme.colorPrimary500};
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #f1f1f1;
    background: #fff;
    color: #000;
    font-weight: 600;
    font-size: 16px;
    &:hover {
      //background-color: ${theme.colorPrimary400};
      background-color: #f5f5f5;
    }
    img {
      width: 28px;
      height: 28px;
    }
  `}
`;

const Content = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
