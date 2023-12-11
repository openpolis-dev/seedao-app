import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useSNSContext } from './snsProvider';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import UserSVGIcon from 'components/svgs/user';
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
    <Container>
      <ContainerTop bg={theme ? 'dark' : 'light'}>
        <img src={theme ? NiceDarkIcon : NiceIcon} alt="" />
      </ContainerTop>
      <ContainerBottom>
        <div className="title">{sns}.seedao</div>
        <div className="success">{t('SNS.FinishSucess')}</div>
        {/* <Cover></Cover>
        <Link to="/onboarding/learn">
          <WatchButton>{t('Onboarding.WatchButton')}</WatchButton>
        </Link> */}
      </ContainerBottom>
      {/* <UserEntrance to="/sns/user">
        <UserSVGIcon />
        <span>{t('SNS.MySNS')}</span>
      </UserEntrance> */}
    </Container>
  );
}
const Container = styled.div`
  background-color: var(--bs-box-background);
  height: 482px;
  width: 669px;
  box-shadow: 2px 4px 4px 0px var(--box-shadow);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
`;

const ContainerTop = styled.div<{ bg: string }>`
  height: 120px;
  background: ${(props) =>
    props.bg === 'dark'
      ? 'linear-gradient(207deg, #ff4974 10%, #9668f2 58%, #4500d6 100%)'
      : 'linear-gradient(207deg, #f7e1ed 10%, #f8fff8 58%, #e9deff 100%)'};
  text-align: center;
  padding-top: 16px;
  box-sizing: border-box;
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
    color: var(--sns-font-color);
  }
`;

const Cover = styled.div`
  width: 80%;
  height: 260px;
  background-color: #000;
  border-radius: 8px;
  margin: 20px auto;
`;

const WatchButton = styled(Button)``;

const UserEntrance = styled(Link)`
  position: absolute;
  background: var(--home-right);
  border-radius: 8px;
  opacity: 1;
  border: 1px solid var(--table-border);
  font-size: 14px;
  height: 36px;
  padding-inline: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  top: 24px;
  right: 24px;
  user-select: none;
  color: var(--bs-body-color_active) !important;
  &:hover {
    color: var(--bs-body-color_active);
  }
`;
