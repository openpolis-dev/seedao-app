import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';

export default function Onboarding() {
  const { t } = useTranslation();

  return (
    <Page>
      <BackerNav to="/home" title={t('general.back')} />
      <Container>
        <NFTBox />
        <div>{t('Onboarding.Congrats')}</div>
        <div>
          <div>{t('apps.Newer')}</div>
          <QrCodeImg />
        </div>
      </Container>
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding}
`;
const Container = styled.div`
  width: 60%;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  gap: 20px;
  text-align: center;
`;

const NFTBox = styled.div`
  width: 200px;
  height: 200px;
  background-color: #000;
  border-radius: 8px;
`;

const QrCodeImg = styled.div`
  width: 200px;
  height: 200px;
  background-color: #000;
  border-radius: 8px;
`;
