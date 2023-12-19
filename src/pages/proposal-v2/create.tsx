import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';

export default function CreateProposalPage() {
  const { t } = useTranslation();
  return (
    <Page>
      <BackerNav title={t('Proposal.CreateProposal')} to="/proposal-v2" />
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;
