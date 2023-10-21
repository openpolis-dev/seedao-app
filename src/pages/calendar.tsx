import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import React from 'react';
import CalendarBox from 'components/calendar';

export default function CalendarPage() {
  return (
    <PageStyle>
      {/*{loading && <LoadingBox />}*/}
      <CalendarBox />
    </PageStyle>
  );
}

const PageStyle = styled.div`
  ${ContainerPadding};
`;
