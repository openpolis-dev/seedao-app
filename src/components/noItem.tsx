import styled from 'styled-components';

import React from 'react';
import { Calendar3Range } from 'react-bootstrap-icons';

const Box = styled.div`
  background: #f8f8f8;
  padding: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aaa;
  .sizeTop {
    font-size: 40px;
    margin-bottom: 10px;
  }
`;

export default function NoItem() {
  return (
    <Box>
      <div>
        {/*<EvaIcon name="monitor-outline" className="sizeTop" />*/}
        <Calendar3Range className="sizeTop" />
      </div>
      <div>No Data</div>
    </Box>
  );
}
