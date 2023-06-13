import { Button } from '@paljs/ui';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import React from 'react';
import styled from 'styled-components';
import { injected as connector } from 'wallet/connector';

export default function LoginModal() {
  const { dispatch } = useAuthContext();
  const connect = async () => {
    await connector.activate();
    // TODO
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };
  return (
    <Mask>
      <Modal>
        <Button onClick={connect}>MetaMask</Button>
      </Modal>
    </Mask>
  );
}

const Mask = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(45, 51, 46, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 632px;
  height: 292px;
  opacity: 1;
  border-radius: 20px;
  background: #fff linear-gradient(90deg, rgba(235, 255, 255, 0.6) 0%, rgba(230, 255, 255, 0) 100%);
  padding: 60px 48px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
