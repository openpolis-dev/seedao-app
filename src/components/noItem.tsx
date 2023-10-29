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
  .text {
    margin-top: 30px;
    color: var(--bs-body-color_active);
    font-size: 14px;
  }
`;

interface IProps {
  text?: string;
  [key: string]: any;
}

export default function NoItem({ text, ...rest }: IProps) {
  const {
    state: { theme },
  } = useAuthContext();
  return (
    <Box {...rest}>
      <div>
        <img src={theme ? EmptyDarkIcon : EmptyLightIcon} alt="" className="sizeTop" />
      </div>
      <div className="text">{text || 'No Data'}</div>
    </Box>
  );
}
