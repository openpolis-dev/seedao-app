import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled, { DefaultTheme } from 'styled-components';
import { LayoutHeader } from '@paljs/ui/Layout';
import { Actions } from '@paljs/ui/Actions';
import ContextMenu from '@paljs/ui/ContextMenu';
import User from '@paljs/ui/User';
import { breakpointDown } from '@paljs/ui/breakpoints';
import Select from '@paljs/ui/Select';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { useWeb3React } from '@web3-react/core';
import { Button } from '@paljs/ui';
import LoginModal from 'components/modals/login';
import PublicJs from 'utils/publicJs';

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
  const router = useRouter();
  const { account } = useWeb3React();
  const [lan, setLan] = useState('en');

  const {
    state: { show_login_modal },
    dispatch,
  } = useAuthContext();

  const changeLang = (v: string) => {
    router.query.lang = v;
    setLan(v);
    router.push(router);
    localStorage.setItem('language', v);
  };

  useEffect(() => {
    let myLan = localStorage.getItem('language');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('language', lan);
      setLan(lan);
      changeLang(lan);
    } else {
      setLan(myLan!);
      changeLang(myLan!);
    }
  }, []);

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
                  value={getLanguages().find((item) => item.value === router.query.lang) || getLanguages()[0]}
                  options={getLanguages()}
                />
              ),
            },
            {
              content: (
                <ContextMenu
                  nextJs
                  style={{ cursor: 'pointer' }}
                  placement="bottom"
                  currentPath={router.pathname}
                  items={[
                    { title: 'Profile', link: { href: '/user/profile' } },
                    { title: 'Vault', link: { href: '/user/vault' } },
                  ]}
                  Link={Link}
                >
                  {account ? (
                    <User image="url('/icons/icon-72x72.png')" name={PublicJs.AddressToShow(account)} size="Medium" />
                  ) : (
                    <Button onClick={showWalletLogin}>Connect Wallet</Button>
                  )}
                </ContextMenu>
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
