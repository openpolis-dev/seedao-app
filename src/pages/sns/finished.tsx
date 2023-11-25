import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function FinishedComponent() {
  const { t } = useTranslation();
  return (
    <Container>
      <ContainerTop>
        <CircleBox></CircleBox>
      </ContainerTop>
      <ContainerBottom>
        <div className="title">aaa.seedao</div>
        <div className="success">{t('SNS.FinishSucess')}</div>
      </ContainerBottom>
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
  overflow: hidden;
`;

const ContainerTop = styled.div`
  height: 180px;
  background: linear-gradient(207deg, #f7e1ed 10%, #f8fff8 58%, #e9deff 100%);
  text-align: center;
`;

const CircleBox = styled.div`
  width: 173px;
  height: 173px;
  background: linear-gradient(157deg, #ffffff 0%, #fbecff 100%);
  box-shadow: 10px 10px 10px 0px rgba(246, 245, 255, 0.36);
  border-radius: 50%;
  position: relative;
  top: 57px;
  display: inline-block;
`;

const ContainerBottom = styled.div`
  text-align: center;
  padding-top: 82px;

  .title {
    font-family: 'Poppins-SemiBold';
    font-size: 34px;
    font-weight: 600;
    line-height: 54px;
    letter-spacing: 1;
    color: var(--bs-body-color_active);
  }
  .success {
    font-family: 'Poppins-Medium';
    font-size: 14px;
    font-weight: 500;
    color: #534e59;
  }
`;
