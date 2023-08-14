import React, { useState, useRef, useEffect, Fragment, useMemo } from 'react';
import styled, { DefaultTheme, ThemeProvider } from 'styled-components';
import themes from './themes';
import { Layout, LayoutContent, LayoutContainer, LayoutColumns, LayoutColumn } from '@paljs/ui/Layout';
import icons from '@paljs/icons';
import { SidebarBody, SidebarRefObject, Sidebar } from '@paljs/ui/Sidebar';
import Header from './Header';
import SimpleLayout from './SimpleLayout';
import { useRouter } from 'next/router';
// import { EvaIcon } from '@paljs/ui/Icon';
// import { Button } from '@paljs/ui/Button';
import { Menu, MenuRefObject } from '@paljs/ui/Menu';
import Link from 'next/link';
import menuItems, { CMenuItemType } from './menuItem';
import SEO, { SEOProps } from 'components/SEO';
import useTranslation from 'hooks/useTranslation';
import usePermission from 'hooks/usePermission';
import { PermissionAction, PermissionObject } from 'utils/constant';
import useCheckLogin from 'hooks/useCheckLogin';
import { useAuthContext } from 'providers/authProvider';
import { WalletType } from 'wallet/wallet';
import AppVersion from 'components/version';

const getDefaultTheme = (): DefaultTheme['name'] => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as DefaultTheme['name'];
  } else {
    // const hours = new Date().getHours();
    // return hours > 6 && hours < 19 ? 'default' : 'dark';
    return 'default';
  }
};

const Box = styled.div`
  .expanded.menu-sidebar,
  .expanded .main-container {
    width: 12rem;
  }
`;

const LayoutPage: React.FC<SEOProps> = ({ children, ...rest }) => {
  const [theme, setTheme] = useState<DefaultTheme['name']>('default');
  const { t } = useTranslation();
  const isLogin = useCheckLogin();
  const {
    state: { wallet_type, userData },
  } = useAuthContext();
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const sidebarRef = useRef<SidebarRefObject>(null);
  const router = useRouter();
  const menuRef = useRef<MenuRefObject>(null);
  const [seeHeader, setSeeHeader] = useState(true);
  const AnyComponent = ThemeProvider as any;
  const MyGlobalStyle = SimpleLayout as any;

  const canUseCityhall = usePermission(PermissionAction.AuditApplication, PermissionObject.ProjectAndGuild);

  const getState = (state?: 'hidden' | 'visible' | 'compacted' | 'expanded') => {
    setSeeHeader(state !== 'compacted');
  };

  const changeTheme = (newTheme: DefaultTheme['name']) => {
    setTheme(newTheme);
    typeof localStorage !== 'undefined' && localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const localTheme = getDefaultTheme();
    if (localTheme !== theme && theme === 'default') {
      setTheme(localTheme);
    }
  }, []);

  const changeDir = () => {
    const newDir = dir === 'ltr' ? 'rtl' : 'ltr';
    setDir(newDir);
  };

  const menuItemsFormat = useMemo(() => {
    const items: CMenuItemType[] = [];
    menuItems.forEach((d) => {
      const item = { ...d, title: t(d.title) };
      if (d.value === 'city-hall') {
        canUseCityhall && items.push(item);
      } else if (d.value === 'chat') {
        isLogin && wallet_type === WalletType.EOA && items.push(item);
      } else {
        items.push(item);
      }
    });
    return items;
  }, [t, canUseCityhall, userData, wallet_type]);

  useEffect(() => {
    const pt = router.pathname;

    const arr = ['proposal', 'project', 'guild', 'chat', 'city-hall', 'assets', 'home'];
    const arrCurrent = arr.find((item) => pt.indexOf(item) > -1);

    if (arrCurrent) {
      const currentItem = menuItems.findIndex((item) => item.link?.href.indexOf(arrCurrent) > -1);
      menuItems.map((item) => {
        item.selected = false;
      });
      menuItems[currentItem].selected = true;
    }
  }, [router]);

  return (
    <Fragment>
      <Box>
        <SEO {...rest} />
        <AnyComponent theme={themes(theme, dir)}>
          <Fragment>
            <MyGlobalStyle />
            <Layout evaIcons={icons} dir={dir}>
              <Header
                dir={dir}
                changeDir={changeDir}
                theme={{ set: changeTheme, value: theme }}
                toggleSidebar={() => sidebarRef.current?.toggle()}
              />
              <LayoutContainer style={{ background: '#F0F3F8' }}>
                <Sidebar
                  getState={getState}
                  ref={sidebarRef}
                  property="start"
                  containerFixed
                  responsive
                  className="menu-sidebar"
                >
                  {seeHeader && (
                    <header>
                      {/*<Button*/}
                      {/*  size="Tiny"*/}
                      {/*  status="Primary"*/}
                      {/*  onClick={() => {*/}
                      {/*    setMenuState(!menuState);*/}
                      {/*    menuRef.current?.toggle();*/}
                      {/*  }}*/}
                      {/*  fullWidth*/}
                      {/*>*/}
                      {/*  {menuState ? <EvaIcon name="arrow-circle-up" /> : <EvaIcon name="arrow-circle-down" />}*/}
                      {/*</Button>*/}
                    </header>
                  )}
                  <SidebarBody>
                    <Menu
                      nextJs
                      className="sidebar-menu"
                      Link={Link}
                      ref={menuRef}
                      items={menuItemsFormat}
                      currentPath={router.pathname}
                      toggleSidebar={() => sidebarRef.current?.hide()}
                    />
                    {seeHeader && <AppVersion />}
                  </SidebarBody>
                </Sidebar>
                <LayoutContent>
                  <LayoutColumns>
                    <LayoutColumn className="main-content">{children}</LayoutColumn>
                  </LayoutColumns>
                </LayoutContent>
              </LayoutContainer>
            </Layout>
          </Fragment>
        </AnyComponent>
      </Box>
    </Fragment>
  );
};

export default LayoutPage;
