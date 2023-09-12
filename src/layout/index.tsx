import styled from 'styled-components';
import Header from './head';
import Menu from './menu';
import { useAuthContext } from '../providers/authProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    state: { expandMenu },
  } = useAuthContext();
  return (
    <div>
      <Header></Header>
      <LayoutBottom>
        <Menu open={expandMenu} />
        <Container>{children}</Container>
      </LayoutBottom>
    </div>
  );
}

const LayoutBottom = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  padding-top: 80px;
  display: flex;
  align-items: stretch;
`;

const Container = styled.div`
  flex: 1;
`;
