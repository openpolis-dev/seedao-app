import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import React, { useState } from 'react';
import LoadingBox from 'components/loadingBox';
import { useAuthContext } from 'providers/authProvider';
import CalendarBox from 'components/calendar';

export default function CalendarPage() {
  const {
    state: { language },
  } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const handleIframeLoad = () => {
    setLoading(false);
  };
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
