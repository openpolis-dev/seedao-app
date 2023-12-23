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
import getConfig from 'utils/envCofnig';
const network = getConfig().NETWORK;

export const initJoyId = () => {
  initConfig({
    name: 'SeeDAO',
    logo: `${window.location.origin}/icon76.png`,
    // optional
    joyidAppURL: getConfig().JOY_ID_URL,
    network: {
      name: network.name,
      chainId: network.chainId,
    },
  });
};

export default function JoyidWeb() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [signInfo, setSignInfo] = useState('');
  const [result, setResult] = useState<any>();
  const [account, setAccount] = useState<string>('');
  const {
    dispatch,
    state: { rpc },
  } = useAuthContext();

  useEffect(() => {
    initJoyId();
  }, []);

  const onClickConnect = async () => {
    try {
      const address = await connect();
      localStorage.setItem(SELECT_WALLET, Wallet.JOYID_WEB);
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
      logError('getMyNonce', error);
      return '';
    }
  };

  const startSign = async (account: string) => {
    try {
      const nonce = await getMyNonce(account);
      const siweMessage = createSiweMessage(account, network.chainId, nonce, 'Welcome to SeeDAO!');
      setMsg(siweMessage);
      const res = await signMessage(siweMessage, account);
      setSignInfo(res);
    } catch (e) {
      logError('signMessage', e);
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
      dispatch({ type: AppActionType.SET_ACCOUNT, payload: account.toLowerCase() });

      const now = Date.now();
      res.data.token_exp = now + res.data.token_exp * 1000;
      dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });
      const provider = new ethers.providers.JsonRpcProvider(rpc || network.rpcs[0], {
        chainId: network.chainId,
        name: network.name,
      });
      dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });
      const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
      await authorizer.setUser(account.toLowerCase());
      dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
      dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: WalletType.EOA });
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
      ReactGA.event('login_success', {
        type: Wallet.JOYID_WEB,
        account: 'account:' + account,
      });
      try {
        await OneSignal.login(account.toLocaleLowerCase());
      } catch (error) {
        logError('OneSignal login error', error);
      }
    } catch (e) {
      logError(e);
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
