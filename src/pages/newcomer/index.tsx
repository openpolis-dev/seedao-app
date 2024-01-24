import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import LearnDashboard from 'components/newcomer/learn';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import sns from '@seedao/sns-js';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DeSchoolProvider, CourseContextProvider } from '@deschool-protocol/react';
import '@deschool-protocol/react/dist/styles/index.css';

export default function Newcomer() {
  const { t } = useTranslation();

  const {
    state: { sns: userSNS, account, userData, deschoolToken },
    dispatch,
  } = useAuthContext();

  useEffect(() => {
    // check SNS
    const checkSNS = async () => {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      account &&
        sns
          ?.name(account)
          .then((r) => {
            if (r) {
              dispatch({ type: AppActionType.SET_SNS, payload: r });
            }
          })
          .finally(() => {
            dispatch({ type: AppActionType.SET_LOADING, payload: false });
          });
    };
    if (userData && !userSNS && account) {
      checkSNS();
    }
  }, [userSNS, account]);

  return (
    <DeSchoolProvider
      config={{
        baseUrl: 'https://deschool.app/api',
        token: deschoolToken,
      }}
    >
      <CourseContextProvider>
        <Page>
          {userSNS ? (
            <Container>
              <LearnDashboard />
            </Container>
          ) : (
            <Container>
              <Tip>{t('Onboarding.UnlockTip')}</Tip>
              <Link to="/sns/register">
                <Button>{t('Onboarding.AquireSNS')}</Button>
              </Link>
            </Container>
          )}
        </Page>
      </CourseContextProvider>
    </DeSchoolProvider>
  );
}

const Page = styled.div`
  ${ContainerPadding}
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  background-image: linear-gradient(to left bottom, #b48ae7, #c4a1ea, #d3b8ee, #e1cff1, #eee7f4);
  height: 482px;
  width: 669px;
  box-shadow: 2px 4px 4px 0px var(--box-shadow);
  border-radius: 16px;
  text-align: center;
  position: relative;
`;

const Tip = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 30px;
  background-image: linear-gradient(to left bottom, #7619e8, #8227e8, #8c33e8, #963ee8, #9f49e8);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  margin-top: 25%;
  margin-bottom: 20px;
`;
