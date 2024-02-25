import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import React from 'react';
import CalendarBox from 'components/calendar';
import { useAuthContext } from '../providers/authProvider';
import BackerNav from '../components/common/backNav';
import { useTranslation } from 'react-i18next';

const TopBox = styled.div`
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
`;

export default function CalendarPage() {
  const {
    state: { theme },
  } = useAuthContext();
  const { t } = useTranslation();

  return (
    <PageStyle>
      <TopBox>
        <BackerNav title={t('apps.OnlineEvent')} to={`/`} mb="20px" />
      </TopBox>
      {/*{loading && <LoadingBox />}*/}
      <CalendarBox theme={theme} />
    </PageStyle>
  );
}

const PageStyle = styled.div`
  ${ContainerPadding};
`;
