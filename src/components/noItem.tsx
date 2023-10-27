import styled from 'styled-components';

import React from 'react';
import EmptyDarkIcon from 'assets/Imgs/dark/empty.svg';
import EmptyLightIcon from 'assets/Imgs/light/empty.svg';
import { useAuthContext } from 'providers/authProvider';

const Box = styled.div`
  padding: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aaa;
  .sizeTop {
    margin-bottom: 10px;
  }
`;

export default function NoItem() {
  const {
    state: { theme },
  } = useAuthContext();
  return (
    <Box>
      <div>
        <img src={theme ? EmptyDarkIcon : EmptyLightIcon} alt="" className="sizeTop" />
      </div>
      <div>No Data</div>
    </Box>
  );
}
