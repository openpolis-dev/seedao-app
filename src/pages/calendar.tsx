import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import { useState } from 'react';
import LoadingBox from 'components/loadingBox';
import { useAuthContext } from 'providers/authProvider';

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
      {loading && <LoadingBox />}
      <iframe
        title="SeeDAO calendar"
        src={`https://calendar.google.com/calendar/embed?hl=${
          language || 'en'
        }&height=600&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FShanghai&showTz=1&showPrint=0&showNav=1&showTitle=0&showDate=1&src=YzcwNGNlNTA5ODUxMmIwYjBkNzA3MjJlNjQzMGFmNDIyMWUzYzllYmM2ZDFlNzJhYTcwYjgyYzgwYmI2OTk5ZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23E4C441`}
        style={{ border: 'none' }}
        width="100%"
        height={600}
        onLoad={handleIframeLoad}
      ></iframe>
    </PageStyle>
  );
}

const PageStyle = styled.div`
  ${ContainerPadding};
`;
