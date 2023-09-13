import styled from 'styled-components';
import Header from './head';
import Menu from './menu';
import { useAuthContext } from '../providers/authProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    state: { expandMenu },
  } = useAuthContext();
  return (
    <Box>
      <Header />
      <LayoutBottom>
        <Menu open={expandMenu} />
        <Container>{children}</Container>
      </LayoutBottom>
    </Box>
  );
}

const Box = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const LayoutBottom = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  padding-top: 80px;
  flex-grow: 1;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
`;

const Container = styled.div`
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: #f0f3f8;
`;
