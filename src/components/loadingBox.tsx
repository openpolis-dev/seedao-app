import React from 'react';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
  display: flex;
  align-items: center;
  justify-content: center;
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
        <SpinnerStyled animation="border" variant="primary"></SpinnerStyled>
        <span>{t('general.Loading')}...</span>
      </Box>
    </Mask>
  );
}
