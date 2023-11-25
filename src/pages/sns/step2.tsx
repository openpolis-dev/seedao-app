import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function RegisterSNSStep2() {
  const { t } = useTranslation();
  return (
    <Container>
      <ContainerWrapper>
        <CurrentSNS>1211.seedao</CurrentSNS>
        <StepTitle>{t('SNS.TimerTitle')}</StepTitle>
        <StepDesc>{t('SNS.TimerDesc')}</StepDesc>
      </ContainerWrapper>
    </Container>
  );
}

const Container = styled.div`
  background-color: var(--bs-box-background);
  height: 482px;
  width: 669px;
  box-shadow: 2px 4px 4px 0px var(--box-shadow);
  border-radius: 16px;
  border: 1px solid var(--table-border);
  text-align: center;
  text-align: center;
`;

const ContainerWrapper = styled.div`
  max-width: 74%;
  display: inline-block;
`;

const CurrentSNS = styled.div`
  font-family: 'Poppins-SemiBold';
  font-weight: 600;
  font-size: 34px;
  color: var(--bs-body-color_active);
  line-height: 54px;
  letter-spacing: 1px;
  margin-top: 47px;
  margin-bottom: 26px;
`;

const StepTitle = styled.div`
  margin-top: 16px;
  color: #534e59;
  line-height: 24px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins-Medium';
`;
const StepDesc = styled.div`
  font-size: 18px;
  color: #534e59;
  font-size: 14px;
  line-height: 24px;

  font-weight: 400;
`;
