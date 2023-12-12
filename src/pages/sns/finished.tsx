import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useSNSContext } from './snsProvider';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import NiceIcon from 'assets/Imgs/sns/nice.svg';
import NiceDarkIcon from 'assets/Imgs/sns/nice_dark.svg';

export default function FinishedComponent() {
  const { t } = useTranslation();
  const {
    state: { theme },
    dispatch,
  } = useAuthContext();
  const {
    state: { sns },
  } = useSNSContext();

  useEffect(() => {
    localStorage.removeItem('sns');
    dispatch({ type: AppActionType.SET_SNS, payload: `${sns}.seedao` });
  }, []);
  return (
    <Container bg={theme ? 'dark' : 'light'}>
      <ContainerTop>
        <img src={theme ? NiceDarkIcon : NiceIcon} alt="" />
        <div className="title">{t('SNS.FinishSucess', { sns: `${sns}.seedao` })}</div>
      </ContainerTop>
      <ContainerBottom>
        <HomeLink to="/home">
          <LinkBox>{t('SNS.Polis')}</LinkBox>
        </HomeLink>
        <ContributeLink href="https://discord.com/channels/841189467128594442/1183811608967921795" target="_blank">
          <LinkBox>{t('SNS.PolisContribute')}</LinkBox>
        </ContributeLink>
      </ContainerBottom>
    </Container>
  );
}
const Container = styled.div<{ bg: string }>`
  background-color: var(--bs-box-background);
  height: 482px;
  width: 669px;
  box-shadow: 2px 4px 4px 0px var(--box-shadow);
  border-radius: 16px;
  overflow: hidden;
  position: relative;

  background: ${(props) =>
    props.bg === 'dark'
      ? 'linear-gradient(207deg, #ff4974 10%, #9668f2 58%, #4500d6 100%)'
      : 'linear-gradient(207deg, #f7e1ed 10%, #f8fff8 58%, #e9deff 100%)'};
`;

const ContainerTop = styled.div`
  text-align: center;
  padding-top: 60px;
  box-sizing: border-box;

  .title {
    font-family: 'Poppins-Medium';
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1;
    color: var(--bs-body-color_active);
    margin-block: 30px;
  }
`;
const ContainerBottom = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
`;

const LinkBox = styled.div`
  width: 160px;
  height: 50px;
  background-color: #fff;
  color: #000;
  border-radius: 8px;
  line-height: 50px;
`;

const HomeLink = styled(Link)``;

const ContributeLink = styled.a``;
