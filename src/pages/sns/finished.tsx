import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import NiceIcon from 'assets/Imgs/sns/nice.svg';
import { useAuthContext } from 'providers/authProvider';
import { useSNSContext } from './snsProvider';
import { useEffect } from 'react';

export default function FinishedComponent() {
  const { t } = useTranslation();
  const {
    state: { theme },
  } = useAuthContext();
  const {
    state: { sns },
  } = useSNSContext();

  useEffect(() => {
    localStorage.removeItem('sns');
  }, []);
  return (
    <Container>
      <ContainerTop bg={theme ? 'dark' : 'light'}>
        <img src={NiceIcon} alt="" />
      </ContainerTop>
      <ContainerBottom>
        <div className="title">{sns}.seedao</div>
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

const ContainerTop = styled.div<{ bg: string }>`
  height: 180px;
  background: ${(props) =>
    props.bg === 'dark'
      ? 'linear-gradient(207deg, #ff4974 10%, #9668f2 58%, #4500d6 100%)'
      : 'linear-gradient(207deg, #f7e1ed 10%, #f8fff8 58%, #e9deff 100%)'};
  text-align: center;
  img {
    position: relative;
    top: 57px;
    display: inline-block;
  }
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
