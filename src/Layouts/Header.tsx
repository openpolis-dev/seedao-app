import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled, { DefaultTheme } from 'styled-components';
import { LayoutHeader } from '@paljs/ui/Layout';
import { Actions } from '@paljs/ui/Actions';
import ContextMenu from '@paljs/ui/ContextMenu';
import User from '@paljs/ui/User';
import { breakpointDown } from '@paljs/ui/breakpoints';
import Select from '@paljs/ui/Select';

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
  const { locale, asPath, pathname } = useRouter();

  const getLanguages = () => [
    {
      value: 'en',
      label: (
        <Link href={`/en${asPath}`} locale="en">
          Engilsh
        </Link>
      ),
    },
    {
      value: 'zh',
      label: (
        <Link href={asPath} locale="zh">
          中文
        </Link>
      ),
    },
  ];

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
                  value={getLanguages().find((item) => item.value === locale)}
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
                  currentPath={pathname}
                  items={[
                    { title: 'Profile', link: { href: '/user' } },
                    { title: 'Vault', link: { href: '/user' } },
                  ]}
                  Link={Link}
                >
                  <User image="url('/icons/icon-72x72.png')" name="Ahmed Elywa" title="Manger" size="Medium" />
                </ContextMenu>
              ),
            },
          ]}
        />
      </HeaderStyle>
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
