import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled, { DefaultTheme } from 'styled-components';
import { LayoutHeader } from '@paljs/ui/Layout';
import { Actions } from '@paljs/ui/Actions';
import ContextMenu from '@paljs/ui/ContextMenu';
import { breakpointDown } from '@paljs/ui/breakpoints';
import Select from '@paljs/ui/Select';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { useWeb3React } from '@web3-react/core';
import { Button } from '@paljs/ui';
import LoginModal from 'components/modals/login';
import PublicJs from 'utils/publicJs';
import useCheckLogin from 'hooks/useCheckLogin';
import { parseToken, checkTokenValid, clearStorage } from 'utils/auth';
import { DefaultAvatar, SEEDAO_USER, SEEDAO_USER_DATA } from 'utils/constant';
import Loading from 'components/loading';
import requests from 'requests';
import { Authorizer } from 'casbin.js';
import { readPermissionUrl } from 'requests/user';
import Image from 'next/image';
import useTranslation from 'hooks/useTranslation';

interface HeaderProps {
  toggleSidebar: () => void;
  theme: {
    set: (value: DefaultTheme['name']) => void;
    value: DefaultTheme['name'];
  };
  changeDir: () => void;
  dir: 'rtl' | 'ltr';
}

const Header: React.FC<HeaderProps> = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { account } = useWeb3React();
  const isLogin = useCheckLogin();
  const [lan, setLan] = useState('en');

  const {
    state: { show_login_modal, language, loading, userData },
    dispatch,
  } = useAuthContext();

  const changeLang = (v: string) => {
    // router.query.lang = v;
    setLan(v);
    dispatch({ type: AppActionType.SET_LAN, payload: v });
    // router.push(router);
    localStorage.setItem('language', v);
  };

  useEffect(() => {
    const myLan = localStorage.getItem('language');
    if (!language) {
      if (!myLan) {
        const lanInit = getLanguages()[0];
        localStorage.setItem('language', lanInit.value);
        changeLang(lanInit.value);
      } else {
        changeLang(myLan!);
      }
    } else {
      changeLang(language);
    }
  }, [language]);

  // useEffect(() => {
  //   let myLan = localStorage.getItem('language');
  //   console.log(myLan)
  //   if (typeof localStorage !== 'undefined') {
  //     let lanInit =  getLanguages()[0];
  //     localStorage.setItem('language', lanInit.value);
  //     setLan(lanInit.value);
  //     changeLang(lanInit.value);
  //   } else {
  //     setLan(myLan!);
  //     changeLang(myLan!);
  //   }
  // }, []);

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
      label: <span onClick={() => changeLang('en')}>English</span>,
    },
    {
      value: 'zh',
      label: <span onClick={() => changeLang('zh')}>中文</span>,
    },
  ];

  const showWalletLogin = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
  };

  // const onSelectLanguage = (data: null | { value: string; label: JSX.Element }) => {};
  return (
    <LayoutHeader fixed>
      {loading && <Loading />}

      <HeaderStyle>
        <Actions
          size="Medium"
          actions={[
            {
              icon: { name: 'menu-2-outline' },
              url: {
                onClick: props.toggleSidebar,
              },
            },
            {
              content: (
                <Link href="/">
                  <a className="logo">
                    <LogoIcon src="/logo.png" alt="" />
                  </a>
                </Link>
              ),
            },
          ]}
        />
        <Actions
          size="Small"
          className="right"
          actions={[
            {
              content: (
                <SelectStyled
                  instanceId="react-select-input"
                  isSearchable={false}
                  shape="SemiRound"
                  placeholder="Themes"
                  value={getLanguages().find((item) => item.value === lan) || getLanguages()[0]}
                  options={getLanguages()}
                />
              ),
            },
            {
              content:
                isLogin && userData ? (
                  <ContextMenu
                    nextJs
                    style={{ cursor: 'pointer' }}
                    placement="bottom"
                    currentPath={router.pathname}
                    items={[
                      { title: t('My.MyProfile'), link: { href: '/user/profile' } },
                      { title: t('My.MyAccount'), link: { href: '/user/vault' } },
                    ]}
                    Link={Link}
                  >
                    <User>
                      <div>
                        <Image src={userData?.avatar || DefaultAvatar} alt="" width="40px" height="40px" />
                      </div>
                      <span>{userData?.name || PublicJs.AddressToShow(userData?.wallet || '')}</span>
                    </User>
                  </ContextMenu>
                ) : (
                  <Button onClick={showWalletLogin}>Connect Wallet</Button>
                ),
            },
          ]}
        />
      </HeaderStyle>
      {show_login_modal && <LoginModal />}
    </LayoutHeader>
  );
};
export default Header;

const HeaderStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  ${breakpointDown('sm')`
    .right{
      display: none;
    }
  `}
  .right > div {
    height: auto;
    display: flex;
    align-content: center;
  }
  .logo {
    font-size: 1.25rem;
    white-space: nowrap;
    text-decoration: none;
  }
  .left {
    display: flex;
    align-items: center;
    .github {
      font-size: 18px;
      margin-right: 5px;
    }
  }
`;

const SelectStyled = styled(Select)`
  min-width: 150px;
`;

const LogoIcon = styled.img`
  //width: 70px;
  height: 65px;
  margin-top: -16px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #edf1f7;
  }
`;
