import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';
import ProposalProvider from './store';
import ChooseTypeStep from './chooseType';
import { useProposalContext } from './store';

const CreateProposalSteps = () => {
  const { currentStep } = useProposalContext();
  switch (currentStep) {
    case 1:
      return <ChooseTypeStep />;
    default:
      return null;
  }
};

export default function CreateProposalPage() {
  const { t } = useTranslation();
  return (
    <Page>
      <BackerNav title={t('Proposal.CreateProposal')} to="/proposal-v2" />
      <ProposalProvider>
        <CreateProposalSteps />
      </ProposalProvider>
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
  color: var(--bs-body-color_active);
`;
