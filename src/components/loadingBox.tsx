import React from 'react';
import styled from 'styled-components';
import Spinner from '@paljs/ui/Spinner';
import useTranslation from 'hooks/useTranslation';

const Mask = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  justify-content: center;
`;
const Box = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  span {
    padding-left: 10px;
  }
`;

const SpinnerStyled = styled(Spinner)`
  background: unset;
`;

export default function LoadingBox() {
  const { t } = useTranslation();
  return (
    <Mask>
      <Box>
        <SpinnerStyled status="Primary" size="Giant">
          {t('general.Loading')}...
        </SpinnerStyled>
      </Box>
    </Mask>
  );
}