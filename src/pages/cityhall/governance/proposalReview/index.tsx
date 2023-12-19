import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';

export default function ProposalReview() {
  const { t } = useTranslation();
  return (
    <Page>
      <BackerNav title={t('city-hall.ReviewProposal')} to="" />
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;
