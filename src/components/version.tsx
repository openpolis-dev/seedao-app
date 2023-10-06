import React from 'react';
import styled from 'styled-components';

export default function AppVersion() {
  return (
    <VersionBox>
      {process.env.REACT_APP_APP_VERSION} Build {process.env.REACT_APP_BUILD_ID?.slice(0, 6)}.
      {process.env.REACT_APP_COMMIT_REF?.slice(0, 6)}
    </VersionBox>
  );
}

const VersionBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 200px;
  font-size: 12px;
  line-height: 40px;
  text-align: center;
  box-sizing: border-box;
  color: #999;
`;
