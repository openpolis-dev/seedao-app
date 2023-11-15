import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import React from 'react';
import CalendarBox from 'components/calendar';
import { useAuthContext } from '../providers/authProvider';

export default function CalendarPage() {
  const {
    state: { theme },
  } = useAuthContext();
  return (
    <PageStyle>
      {/*{loading && <LoadingBox />}*/}
      <CalendarBox theme={theme} />
    </PageStyle>
  );
}

const PageStyle = styled.div`
  ${ContainerPadding};
`;
