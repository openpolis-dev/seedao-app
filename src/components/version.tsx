import React from 'react';
import styled from 'styled-components';

export default function AppVersion() {
  return (
    <VersionBox>
      {process.env.NEXT_PUBLIC_APP_VERSION}.{process.env.NEXT_PUBLIC_COMMIT_HASH}
    </VersionBox>
  );
}

const VersionBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 256px;
  font-size: 12px;
  line-height: 40px;
  text-align: center;
  box-sizing: border-box;
  color: #999;
`;
