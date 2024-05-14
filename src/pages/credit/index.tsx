import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import CreditCards from 'components/credit/cards';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';
import CreditRecords from 'components/credit/records';

export default function CreditPage() {
  const { t } = useTranslation();
  return (
    <Page>
      <BackerNav to="/" title={t('Credit.NavTitle')} />
      <CreditCards />
      <CreditRecords />
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;
