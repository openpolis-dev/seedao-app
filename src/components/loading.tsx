import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import LoadingImg from '../assets/Imgs/loading.png';

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9999;
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
export default function Loading() {
  const { t } = useTranslation();
  return (
    <Mask>
      <Box>
        <img src={LoadingImg} alt="" />
        {/*<Spinner animation="border" variant="primary"></Spinner>*/}
        {/*<div>*/}
        {/*  <span>{t('general.Loading')}...</span>*/}
        {/*</div>*/}
      </Box>
    </Mask>
  );
}
