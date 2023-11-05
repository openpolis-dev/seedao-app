import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';

export default function GoveranceNodeResult() {
  const { t } = useTranslation();
  return (
    <OuterBox>
      <BackerNav title={t('city-hall.GovernanceNodeResult')} to="/city-hall/governance" />
    </OuterBox>
  );
}

const OuterBox = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
`;
