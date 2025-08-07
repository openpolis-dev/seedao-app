import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import LoadingImg from '../assets/Imgs/loading.png';


const Box = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  img {
    user-select: none;
    width: 40px;
    height: 40px;
    animation: rotate 1s infinite linear;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
export default function LoadingInner() {
  const { t } = useTranslation();
  return (
      <Box>
        <img src={LoadingImg} alt="" />
        {/*<Spinner animation="border" variant="primary"></Spinner>*/}
        {/*<div>*/}
        {/*  <span>{t('general.Loading')}...</span>*/}
        {/*</div>*/}
      </Box>
  );
}
