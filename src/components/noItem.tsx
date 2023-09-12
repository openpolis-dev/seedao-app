import styled from 'styled-components';
import { EvaIcon } from '@paljs/ui/Icon';
import React from 'react';

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
        <EvaIcon name="monitor-outline" className="sizeTop" />
      </div>
      <div>No Data</div>
    </Box>
  );
}
