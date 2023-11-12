import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { createSiweMessage } from '../../utils/sign';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import requests from '../../requests';
import { AppActionType, useAuthContext } from '../../providers/authProvider';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from '../../requests/user';
import { Wallet, WalletType } from '../../wallet/wallet';
import { SELECT_WALLET } from '../../utils/constant';
import JoyIdImg from '../../assets/Imgs/home/JOYID.png';
import styled from 'styled-components';
import OneSignal from 'react-onesignal';
import { connect, disconnect, signMessage, initConfig } from '@joyid/evm';
import { clearStorage } from 'utils/auth';

export default function JoyidWeb() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [signInfo, setSignInfo] = useState('');
  const [result, setResult] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>('');
  const { dispatch } = useAuthContext();

  useEffect(() => {
    initConfig({
      name: 'SeeDAO',
      logo: `${window.location.origin}/favicon.ico`,
      // optional
      joyidAppURL: 'https://app.joy.id',
      rpcURL: 'https://mainnet.infura.io/v3/',
      network: {
        name: 'Ethereum Mainnet',
        chainId: 1,
      },
    });
  }, []);

  const onClickConnect = async () => {
    try {
      const address = await connect();
      setAccount(address);
      startSign(address);
    } catch (error) {
      console.log(error);
    }
  };

  const getMyNonce = async (wallet: string) => {
    console.log('getMyNonce', wallet);
    try {
      const rt = await requests.user.getNonce(wallet);
      return rt.data.nonce;
    } catch (error) {
      console.error('getMyNonce', error);
      return '';
    }
  };

  const startSign = async (account: string) => {
    try {
      const nonce = await getMyNonce(account);
      const siweMessage = createSiweMessage(account, 1, nonce, 'Welcome to SeeDAO!');
      setMsg(siweMessage);
      const res = await signMessage(siweMessage, account);
      setSignInfo(res);
    } catch (e) {
      console.error('signMessage', e);
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
      disconnect();
    }
  };

  useEffect(() => {
    if (!signInfo) return;
    LoginTo();
  }, [signInfo]);

  const LoginTo = async () => {
    const { host } = window.AppConfig;
    let obj = {
      wallet: account,
      message: msg,
      signature: signInfo,
      domain: host,
      wallet_type: WalletType.EOA,
      is_eip191_prefix: true,
    };
    try {
      let res = await requests.user.login(obj);
      console.log('LoginTo', res);
      setResult(res.data);
      dispatch({ type: AppActionType.SET_ACCOUNT, payload: account });

      const now = Date.now();
      res.data.token_exp = now + res.data.token_exp * 1000;
      dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });
      dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });
      const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
      await authorizer.setUser(account.toLowerCase());
      dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
      dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: WalletType.AA });
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
      ReactGA.event('login_success', {
        type: Wallet.JOYID_WEB,
        account: 'account:' + account,
      });
      try {
        await OneSignal.login(account.toLocaleLowerCase());
      } catch (error) {
        console.error('OneSignal login error', error);
      }
    } catch (e) {
      console.error(e);
      ReactGA.event('login_failed', { type: 'joyid' });
    }
  };

  useEffect(() => {
    if (!result) return;
    navigate('/home');
  }, [result]);

  return (
    <WalletOption onClick={onClickConnect}>
      <img src={JoyIdImg} alt="" />
      <span>JoyID Passkey</span>
    </WalletOption>
  );
}

const WalletOption = styled.li`
  display: flex;
  align-items: center;
  padding: 14px 28px;
  border-radius: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  background: var(--home-right);
  color: var(--bs-body-color_active);
  font-family: 'Poppins-SemiBold';
  font-weight: 600;
  font-size: 16px;
  &:hover {
    background-color: var(--home-right_hover);
  }
  img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }
`;
