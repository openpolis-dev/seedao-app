import React, { useState, useRef, useEffect, Fragment, useMemo } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import themes from './themes';
import { Layout, LayoutContent, LayoutContainer, LayoutColumns, LayoutColumn } from '@paljs/ui/Layout';
import icons from '@paljs/icons';
import { SidebarBody, SidebarRefObject, Sidebar } from '@paljs/ui/Sidebar';
import Header from './Header';
import SimpleLayout from './SimpleLayout';
import { useRouter } from 'next/router';
import { EvaIcon } from '@paljs/ui/Icon';
import { Button } from '@paljs/ui/Button';
import { Menu, MenuRefObject } from '@paljs/ui/Menu';
import Link from 'next/link';
import menuItems from './menuItem';
import SEO, { SEOProps } from 'components/SEO';
import useTranslation from 'hooks/useTranslation';

const getDefaultTheme = (): DefaultTheme['name'] => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as DefaultTheme['name'];
  } else {
    const hours = new Date().getHours();
    return hours > 6 && hours < 19 ? 'default' : 'dark';
  }
};

const LayoutPage: React.FC<SEOProps> = ({ children, ...rest }) => {
  const [theme, setTheme] = useState<DefaultTheme['name']>('default');
  const { t } = useTranslation();
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const sidebarRef = useRef<SidebarRefObject>(null);
  const router = useRouter();
  const [menuState, setMenuState] = useState(false);
  const menuRef = useRef<MenuRefObject>(null);
  const [seeHeader, setSeeHeader] = useState(true);
  const AnyComponent = ThemeProvider as any;
  const MyGlobalStyle = SimpleLayout as any;
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
    return menuItems.map((d) => ({ ...d, title: t(d.title) }));
  }, [t]);

  return (
    <Fragment>
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
            <LayoutContainer>
              <Sidebar
                getState={getState}
                ref={sidebarRef}
                property="start"
                containerFixed
                responsive
                className="menu-sidebar"
              >
                {/*{seeHeader && (*/}
                {/*  <header>*/}
                {/*    <Button*/}
                {/*      size="Tiny"*/}
                {/*      status="Primary"*/}
                {/*      onClick={() => {*/}
                {/*        setMenuState(!menuState);*/}
                {/*        menuRef.current?.toggle();*/}
                {/*      }}*/}
                {/*      fullWidth*/}
                {/*    >*/}
                {/*      {menuState ? <EvaIcon name="arrow-circle-up" /> : <EvaIcon name="arrow-circle-down" />}*/}
                {/*    </Button>*/}
                {/*  </header>*/}
                {/*)}*/}
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
    </Fragment>
  );
};

export default LayoutPage;
