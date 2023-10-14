import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuthContext, AppActionType } from '../providers/authProvider';
// import { useWeb3React } from '@web3-react/core';
import useCheckLogin from '../hooks/useCheckLogin';
import { parseToken, checkTokenValid, clearStorage } from '../utils/auth';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from '../requests/user';
import requests from '../requests';
import { SEEDAO_ACCOUNT, SEEDAO_USER, SEEDAO_USER_DATA, SELECT_WALLET, SET_PROVIDER } from '../utils/constant';
import Avatar from 'components/common/avatar';
import { Button, Form, Dropdown } from 'react-bootstrap';
import LoginModal from 'components/modals/loginNew';
import LogoImg from '../assets/images/logo.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { List as ListIcon } from 'react-bootstrap-icons';
import Loading from 'components/loading';
import usePushPermission from 'hooks/usePushPermission';
import { requestSetDeviceLanguage, getPushDevice } from 'requests/push';
import { useDisconnect } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { Wallet, WalletType } from 'wallet/wallet';

export default function Header() {
  const { i18n } = useTranslation();
  // const { account } = useWeb3React();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasGranted, handlePermission } = usePushPermission();
  const { disconnect } = useDisconnect();

  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    setList([
      { title: t('My.MyProfile'), link: '/user/profile', value: 'profile' },
      { title: t('My.MyAccount'), link: '/user/vault', value: 'vault' },
    ]);
  }, [i18n.language]);
  const [lan, setLan] = useState('en');

  const {
    state: { show_login_modal, language, expandMenu, userData, loading, account },
    dispatch,
  } = useAuthContext();

  const isLogin = useCheckLogin(account);

  const changeLang = (v: string, select?: boolean) => {
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
          wallet_type = WalletType.AA;
          break;
      }
      wallet_type && dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: wallet_type });
    }
  }, []);

  const getUser = async () => {
    const res = await requests.user.getUser();
    dispatch({ type: AppActionType.SET_USER_DATA, payload: res.data });
    initAuth();
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const initProvider = async () => {
      const { ethereum } = window as any;
      ethereum?.on('chainChanged', (chainId: any) => {
        if (parseInt(chainId, 16) !== mainnet.id) {
          onClickLogout();
        }
      });
      ethereum?.on('accountsChanged', function () {
        onClickLogout();
      });
    };

    initProvider();
  }, []);

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

  const showWalletLogin = () => {
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

  const onClickLogout = () => {
    disconnect();
    dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
    // localStorage.removeItem(SEEDAO_USER_DATA);
    // localStorage.removeItem(SELECT_WALLET);
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
    toGo();
    window.location.reload();
  };

  return (
    <HeadeStyle>
      {loading && <Loading />}
      <nav>
        <NavLeft>
          <MenuExpandIcon
            fontSize="30px"
            onClick={() => dispatch({ type: AppActionType.SET_EXPAND_MENU, payload: !expandMenu })}
          />
          <LogoIcon onClick={() => toGo()}>
            <img src={LogoImg} alt="" />
          </LogoIcon>
        </NavLeft>

        <RightBox>
          <Form.Select
            style={{ minWidth: '100px' }}
            value={getLanguages().find((item) => item.value === lan)?.value || getLanguages()[0].value}
            onChange={(event: any) => changeLang(event.target.value, true)}
          >
            {getLanguages().map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Form.Select>

          {isLogin && userData ? (
            <Dropdown>
              <Dropdown.Toggle variant="success" className="dropBox">
                <Avatar user={userData} />
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
            <Button onClick={showWalletLogin}>{t('menus.connectWallet')}</Button>
          )}
        </RightBox>
      </nav>
      {/*{show_login_modal && <LoginModal />}*/}
      <LoginModal showModal={show_login_modal} />
    </HeadeStyle>
  );
}

const HeadeStyle = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  nav {
    box-shadow: rgba(44, 51, 73, 0.1) 0px 0.5rem 1rem 0px;
    height: 80px;
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
  .dropBtm {
    border: 0;
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
  @media (max-width: 1024px) {
    nav {
      height: 60px;
    }
  }
`;

const LogoIcon = styled.div`
  //width: 70px;

  img {
    height: 65px;
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
const MenuExpandIcon = styled(ListIcon)`
  cursor: pointer;
  color: #666;
`;
