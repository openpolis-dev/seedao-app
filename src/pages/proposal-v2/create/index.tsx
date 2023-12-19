import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';
import ProposalProvider from './store';
import ChooseTypeStep from './chooseType';
import { useProposalContext } from './store';

const CreateProposalSteps = () => {
  const { t } = useTranslation();
  const { currentStep, changeStep } = useProposalContext();

  const showstep = () => {
    switch (currentStep) {
      case 1:
        return <ChooseTypeStep />;
      default:
        return null;
    }
  };

  const backTo = () => {
    if (currentStep === 1) {
      return '/proposal-v2';
    } else {
      // back to step 1
      changeStep(1);
    }
  };

  return (
    <>
      <BackerNav title={t('Proposal.CreateProposal')} to="/proposal-v2" onClick={backTo} />
      <ProposalProvider>
        {showstep()}
        <CreateProposalSteps />
      </ProposalProvider>
    </>
  );
};

export default function CreateProposalPage() {
  return (
    <Page>
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
