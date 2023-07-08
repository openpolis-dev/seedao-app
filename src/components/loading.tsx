import React from 'react';
import styled from 'styled-components';
import Spinner from '@paljs/ui/Spinner';
import useTranslation from 'hooks/useTranslation';

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999999999999999999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    margin-right: 20px;
  }
`;
const Box = styled.div`
  width: 300px;
  height: 300px;
  span {
    padding-left: 10px;
  }
`;
export default function Loading() {
  const { t } = useTranslation();
  return (
    <Mask>
      <Box>
        <Spinner status="Primary" size="Giant">
          <span>{t('general.Loading')}...</span>
        </Spinner>
      </Box>
    </Mask>
  );
}
