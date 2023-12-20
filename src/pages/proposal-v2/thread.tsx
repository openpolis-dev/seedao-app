import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import ReplyComponent from 'components/proposalCom/reply';

export default function ThreadPage() {
  return (
    <Page>
      <ReplyComponent />
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;
