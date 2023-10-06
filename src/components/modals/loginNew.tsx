import { useAuthContext, AppActionType } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import useToast, { ToastType } from 'hooks/useToast';
import { useTranslation } from 'react-i18next';
import { X } from 'react-bootstrap-icons';

import Metamask from '../login/metamask';
import Unipass from '../login/unipass';
// import Joyid from "../login/joyid";

export default function LoginModal() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { Toast, showToast } = useToast();

  const closeModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  return (
    <Mask>
      {/*{Toast}*/}
      <Modal>
        <span className="icon-close" onClick={closeModal}>
          {/*<EvaIcon name="close-outline" />*/}
          <X />
        </span>

        <Title>{t('general.ConnectWallet')}</Title>
        <Content>
          <Metamask />
          <Unipass />
          {/*<Joyid />*/}
        </Content>
      </Modal>
    </Mask>
  );
}

const Mask = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100vw;
  height: 100vh;
  background: rgba(45, 51, 46, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 400px;
  height: 300px;
  opacity: 1;
  border-radius: 8px;
  background: #fff linear-gradient(90deg, rgba(235, 255, 255, 0.6) 0%, rgba(230, 255, 255, 0) 100%);
  padding: 40px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    font-size: 24px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
`;

const Content = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
