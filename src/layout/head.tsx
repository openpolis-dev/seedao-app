import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuthContext, AppActionType } from '../providers/authProvider';
// import { useWeb3React } from '@web3-react/core';
import useCheckLogin from '../hooks/useCheckLogin';
import { parseToken, checkTokenValid, clearStorage } from '../utils/auth';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from '../requests/user';
import requests from '../requests';
import { SEEDAO_ACCOUNT, SEEDAO_USER, SEEDAO_USER_DATA, SELECT_WALLET } from '../utils/constant';
import Avatar from 'components/common/avatar';
import { Button, Form, Dropdown } from 'react-bootstrap';
import LoginModal from 'components/modals/loginNew';

import Select from 'components/common/select';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { List as ListIcon } from 'react-bootstrap-icons';
import usePushPermission from 'hooks/usePushPermission';
import { requestSetDeviceLanguage, getPushDevice } from 'requests/push';
import { useDisconnect } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { Wallet, WalletType } from 'wallet/wallet';
import OneSignal from 'react-onesignal';
import LightImg from '../assets/Imgs/light.png';
import MoonImg from '../assets/Imgs/moon.png';

import LogoImg from '../assets/Imgs/light/logo.svg';
import LogoImgDark from '../assets/Imgs/dark/logo.svg';
import getConfig from 'utils/envCofnig';

export default function Header() {
  const { i18n } = useTranslation();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasGranted, handlePermission } = usePushPermission();
  const { disconnect } = useDisconnect();

  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    setList([
      { title: t('My.MyProfile'), link: '/user/profile', value: 'profile' },
      // { title: t('My.MyAccount'), link: '/user/vault', value: 'vault' },
    ]);
  }, [i18n.language]);
  const [lan, setLan] = useState('en');

  const {
    state: { show_login_modal, language, theme, userData, account },
    dispatch,
  } = useAuthContext();

  const isLogin = useCheckLogin(account);

  const changeLang = (v: any, select?: boolean) => {
    setLan(v);
    dispatch({ type: AppActionType.SET_LAN, payload: v });
    localStorage.setItem('language', v);
    i18n.changeLanguage(v);
    if (select && isLogin && userData) {
      try {
        requestSetDeviceLanguage({ device: getPushDevice(), language: v });
      } catch (error) {
        console.error('Set Device Language Failed', error);
      }
    }
  };

  useEffect(() => {
    const myLan = localStorage.getItem('language');
    if (!language) {
      if (!myLan) {
        const lanInit = getLanguages()[0];
        localStorage.setItem('language', lanInit.value);
        changeLang(lanInit.value);
      } else {
        console.log(myLan);
        changeLang(myLan);
      }
    } else {
      changeLang(language);
    }
  }, [language]);

  const initAuth = async () => {
    if (!account) {
      return;
    }
    // config permission authorizer
    const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
    await authorizer.setUser(account.toLowerCase());
    dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
  };

  useEffect(() => {
    const acc = localStorage.getItem(SEEDAO_ACCOUNT);
    if (acc) {
      dispatch({ type: AppActionType.SET_ACCOUNT, payload: acc });
    }
    const selectWallet = localStorage.getItem(SELECT_WALLET);
    let wallet_type: WalletType | undefined = undefined;
    if (selectWallet) {
      switch (selectWallet) {
        case Wallet.METAMASK:
          wallet_type = WalletType.EOA;
          break;
        case Wallet.UNIPASS:
        case Wallet.JOYID:
        case Wallet.JOYID_WEB:
          wallet_type = WalletType.AA;
          break;
      }
      wallet_type && dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: wallet_type });
    }
  }, []);

  const getUser = async () => {
    const res = await requests.user.getUser();
    dispatch({ type: AppActionType.SET_USER_DATA, payload: res });
    initAuth();
  };

  const handleChainChanged = (chainId: any) => {
    if (parseInt(chainId, 16) !== mainnet.id) {
      onClickLogout();
    }
  };

  const handleAccountChanged = (data: any) => {
    if (!show_login_modal) onClickLogout();
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const initProvider = async () => {
      const { ethereum } = window as any;
      ethereum?.on('chainChanged', handleChainChanged);
      ethereum?.on('accountsChanged', handleAccountChanged);
    };
    initProvider();
    return () => {
      const { ethereum } = window as any;
      ethereum?.removeListener('chainChanged', handleChainChanged);
      ethereum?.removeListener('accountsChanged', handleAccountChanged);
    };
  });

  useEffect(() => {
    isLogin && getUser();
  }, [isLogin]);

  useEffect(() => {
    if (!dispatch) {
      return;
    }
    const tokenDataStr = localStorage.getItem(SEEDAO_USER) || '';
    const tokenData = parseToken(tokenDataStr);
    if (!checkTokenValid(tokenData?.token, tokenData?.token_exp)) {
      clearStorage();
    } else {
      const local_user_data = localStorage.getItem(SEEDAO_USER_DATA) || '';
      let user;
      try {
        user = JSON.parse(local_user_data) || {};
      } catch (error) {}
      tokenData &&
        dispatch({
          type: AppActionType.SET_LOGIN_DATA,
          payload: {
            ...tokenData,
            user,
          },
        });
    }
  }, [dispatch]);

  const getLanguages = () => [
    {
      value: 'en',
      label: 'English',
    },
    {
      value: 'zh',
      label: '中文',
    },
  ];

  const showWalletLogin = async () => {
    if (!hasGranted) {
      handlePermission().finally(() => {
        dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      });
    } else {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
    }
  };
  const toGo = () => {
    navigate('/');
  };

  const onClickLogout = async () => {
    disconnect();
    dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
    // localStorage.removeItem(SEEDAO_USER_DATA);
    localStorage.removeItem(SELECT_WALLET);
    // localStorage.removeItem(SEEDAO_ACCOUNT);
    localStorage.removeItem('joyid-status');
    localStorage.removeItem('joyid-msg');
    localStorage.removeItem('joyid-address');
    // localStorage.removeItem('select_wallet');
    dispatch({ type: AppActionType.SET_PROVIDER, payload: null });
    dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: null });
    dispatch({ type: AppActionType.SET_AUTHORIZER, payload: null });
    dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: null });
    dispatch({ type: AppActionType.SET_ACCOUNT, payload: null });
    try {
      await OneSignal.logout();
    } catch (error) {
      console.error('onesignal logout failed', error);
    }
    toGo();
    window.location.reload();
  };

  useEffect(() => {
    let theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-bs-theme', theme);
      dispatch({
        type: AppActionType.SET_THEME,
        payload: theme === 'dark',
      });
    }
  }, []);

  const SwitchThemeFun = () => {
    let themeStr = document.documentElement.getAttribute('data-bs-theme');
    console.log(themeStr);
    let str = '';
    //theme true dark
    if (themeStr === 'dark') {
      str = 'light';
    } else {
      str = 'dark';
    }
    dispatch({
      type: AppActionType.SET_THEME,
      payload: str === 'dark',
    });
    document.documentElement.setAttribute('data-bs-theme', str);
    localStorage.setItem('theme', str);
  };

  return (
    <HeadeStyle>
      <nav>
        <NavLeft>
          {/*<MenuExpandIcon*/}
          {/*  fontSize="30px"*/}
          {/*  onClick={() => dispatch({ type: AppActionType.SET_EXPAND_MENU, payload: !expandMenu })}*/}
          {/*/>*/}
          <LogoIcon onClick={() => toGo()}>
            <img src={theme ? LogoImgDark : LogoImg} alt="" />
          </LogoIcon>
        </NavLeft>

        <RightBox>
          {getConfig().REACT_APP_THEME_ENABLE && (
            <SwitchTheme>
              <img src={theme ? LightImg : MoonImg} alt="" onClick={() => SwitchThemeFun()} />
            </SwitchTheme>
          )}
          <Select
            options={getLanguages()}
            onChange={(event: any) => changeLang(event.value, true)}
            value={getLanguages().find((item) => item.value === lan) || getLanguages()[0]}
            width="100px"
            NotClear={true}
            isSearchable={false}
          />

          {isLogin && userData ? (
            <Dropdown>
              <Dropdown.Toggle variant="primary" className="dropBox">
                <Avatar user={(userData as any).data} />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropBtm">
                {list.map((item, index) => (
                  <Dropdown.Item key={`userDown_${index}`} href={item.link}>
                    {item.title}
                  </Dropdown.Item>
                ))}
                <Dropdown.Item onClick={onClickLogout}>{t('My.Exit')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <ConnectButton onClick={showWalletLogin}>{t('menus.connectWallet')}</ConnectButton>
          )}
        </RightBox>
      </nav>
      <LoginModal showModal={show_login_modal} />
    </HeadeStyle>
  );
}

const SwitchTheme = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 24px;
  flex-shrink: 0;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
`;

const HeadeStyle = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: var(--bs-background);
  border-bottom: 1px solid var(--bs-border-color);

  .form-select:focus {
    border-color: var(--bs-border-color-focus);
  }
  nav {
    height: 72px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dropBox {
    display: flex;
    align-items: center;
  }
  .dropdown button {
    border-color: transparent !important;
  }
  .dropdown-item {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    font-size: 14px;
    text-align: center;
    &:hover {
      color: var(--bs-primary);
    }
    &:active {
      color: var(--bs-primary);
      background-color: var(--bs-dropdown-link-hover-bg);
    }
    &:last-child {
      border-bottom: 0;
    }
  }
  .dropBtm {
    margin-top: 10px;
    overflow: hidden;
    padding: 0;
  }
  .dropdown-item {
    color: var(--bs-body-color_active);

    &:hover {
      color: var(--bs-body-color_active);
      background: var(--bs-menu-hover);
    }
  }
  @media (max-width: 1440px) {
    nav {
      height: 60px;
    }
  }
`;

const LogoIcon = styled.div`
  //width: 70px;

  img {
    height: 26px;
    cursor: pointer;
  }

  //margin-top: -16px;
`;
const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-left: 20px;
`;

const ConnectButton = styled(Button)`
  height: 40px;
`;
