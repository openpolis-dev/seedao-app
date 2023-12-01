import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { createSiweMessage } from '../../utils/sign';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import requests from '../../requests';
import { AppActionType, useAuthContext } from '../../providers/authProvider';
import { SEEDAO_USER_DATA } from '../../utils/constant';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from '../../requests/user';
import { WalletType, Wallet } from '../../wallet/wallet';
import { clearStorage } from '../../utils/auth';
import { SELECT_WALLET } from '../../utils/constant';
import styled from 'styled-components';
import MetamaskIcon from '../../assets/Imgs/home/METAmask.svg';
import OneSignal from 'react-onesignal';
import getConfig from 'utils/envCofnig';

const network = getConfig().NETWORK;

export default function Metamask() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const [msg, setMsg] = useState('');
  const [signInfo, setSignInfo] = useState('');
  const [result, setResult] = useState<any>();

  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState('');

  useEffect(() => {
    if (!signInfo) return;
    LoginTo();
  }, [signInfo]);

  useEffect(() => {
    if (!provider || !account) return;

    sign();
  }, [provider, account]);

  const onClick = async () => {
    if (!window.ethereum) {
      window.open('https://metamask.io/download.html', '_blank');
      return;
    }
    try {
      localStorage.setItem(SELECT_WALLET, Wallet.METAMASK_INJECTED);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
    } catch (e) {
      console.error('connect', e);
      // dispatch({ type: AppActionType.SET_LOADING, payload: false });
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
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

  const sign = async () => {
    if (!provider || !account) return;
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const nonce = await getMyNonce(account);
      const eip55Addr = ethers.utils.getAddress(account);
      console.error(eip55Addr);
      const siweMessage = createSiweMessage(eip55Addr, network.chainId, nonce, 'Welcome to SeeDAO!');
      setMsg(siweMessage);
      const signer = provider.getSigner();
      const signData = await signer.signMessage(siweMessage);
      setSignInfo(signData);
    } catch (e) {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
      console.error('sign error:', e);
    }
  };

  useEffect(() => {
    if (!result) return;
    if (!pathname.includes('/sns')) {
      navigate('/home');
    }
  }, [result]);

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
      setResult(res.data);

      const now = Date.now();
      res.data.token_exp = now + res.data.token_exp * 1000;
      dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });

      dispatch({ type: AppActionType.SET_ACCOUNT, payload: account });
      dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });

      const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
      await authorizer.setUser(account.toLowerCase());
      dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
      dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: WalletType.EOA });
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
      ReactGA.event('login_success', {
        type: 'metamask',
        account: 'account:' + account,
      });
      try {
        await OneSignal.login(account.toLocaleLowerCase());
      } catch (error) {
        console.error('OneSignal login error', error);
      }
    } catch (e) {
      console.error('Login to', e);
      dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
      localStorage.removeItem(SEEDAO_USER_DATA);
      clearStorage();
      dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: null });
      dispatch({ type: AppActionType.SET_AUTHORIZER, payload: null });
      dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: null });
      // disconnect();
      ReactGA.event('login_failed', { type: 'metamask' });
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
      // close();
    }
  };

  return (
    <WalletOption onClick={() => onClick()}>
      <img src={MetamaskIcon} alt="" />
      <span>MetaMask</span>
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
