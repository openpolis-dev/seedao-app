import styled from 'styled-components';
import { useEffect } from 'react';
import Header from './head';
import Menu from './menu';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useMedia from 'hooks/useMedia';

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMedium = useMedia('(max-width: 1200px)');
  const { dispatch } = useAuthContext();
  useEffect(() => {
    dispatch({ type: AppActionType.SET_EXPAND_MENU, payload: !isMedium });
  }, [isMedium, dispatch]);
  return (
    <Box>
      <Header />
      <LayoutBottom>
        <Menu isMedium={isMedium} />
        <Container id="scrollableDiv">{children}</Container>
      </LayoutBottom>
    </Box>
  );
}

const Box = styled.div`
  height: 100vh;
`;

const LayoutBottom = styled.div`
  width: 100%;
  height: 100vh;
  padding-top: 72px;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  position: relative;
  @media (max-width: 1440px) {
    padding-top: 60px;
  }
`;

const Container = styled.div`
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: var(--rht-bg);
`;
