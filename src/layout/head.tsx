import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuthContext, AppActionType } from '../providers/authProvider';
import { useWeb3React } from '@web3-react/core';
import useCheckLogin from '../hooks/useCheckLogin';
import { parseToken, checkTokenValid, clearStorage } from '../utils/auth';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from '../requests/user';
import requests from '../requests';
import { SEEDAO_USER, SEEDAO_USER_DATA } from '../utils/constant';
import Avatar from 'components/common/avatar';
import { Button, Form, Dropdown } from 'react-bootstrap';
import LoginModal from 'components/modals/login';
import LogoImg from '../assets/images/logo.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { i18n } = useTranslation();
  const { account } = useWeb3React();
  const isLogin = useCheckLogin();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [list] = useState([
    { title: t('My.MyProfile'), link: '/user/profile', value: 'profile' },
    { title: t('My.MyAccount'), link: '/user/vault', value: 'vault' },
    { title: t('My.Exit'), value: 'logout' },
  ]);
  const [lan, setLan] = useState('en');

  const {
    state: { show_login_modal, language, loading, userData },
    dispatch,
  } = useAuthContext();

  const changeLang = (v: string) => {
    setLan(v);
    dispatch({ type: AppActionType.SET_LAN, payload: v });
    localStorage.setItem('language', v);
    i18n.changeLanguage(v);
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
    dispatch({ type: AppActionType.SET_ACCOUNT, payload: account });
  }, [account]);

  const getUser = async () => {
    const res = await requests.user.getUser();
    dispatch({ type: AppActionType.SET_USER_DATA, payload: res.data });
    initAuth();
  };

  useEffect(() => {
    const initProvider = async () => {
      const { ethereum } = window as any;
      ethereum?.on('chainChanged', () => {
        window.location.reload();
      });
      ethereum?.on('accountsChanged', function () {
        window.location.reload();
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
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
  };
  const toGo = () => {
    navigate('/');
  };

  return (
    <HeadeStyle>
      <nav>
        <LogoIcon onClick={() => toGo()}>
          <img src={LogoImg} alt="" />
        </LogoIcon>
        <RightBox>
          <Form.Select
            style={{ minWidth: '100px' }}
            value={getLanguages().find((item) => item.value === lan)?.value || getLanguages()[0].value}
            onChange={(event: any) => changeLang(event.target.value)}
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

              <Dropdown.Menu>
                {list.map((item, index) => (
                  <Dropdown.Item key={`userDown_${index}`} href={item.link}>
                    {item.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button onClick={showWalletLogin}>Connect Wallet</Button>
          )}
        </RightBox>
      </nav>
      {show_login_modal && <LoginModal />}
    </HeadeStyle>
  );
}

const HeadeStyle = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  //z-index: 9;
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
