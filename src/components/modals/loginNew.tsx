import { useAuthContext, AppActionType } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';
import { X } from 'react-bootstrap-icons';

import Metamask from '../login/metamask';
import Unipass, { upProvider } from '../login/unipass';
// import Joyid from '../login/joyid';

import { useNetwork } from 'wagmi';
import { useEthersSigner } from '../login/ethersNew';
import { SELECT_WALLET } from '../../utils/constant';
import { ethers } from 'ethers';
import { mainnet } from 'wagmi/chains';

export default function LoginModal({ showModal }: any) {
  const { t } = useTranslation();

  const {
    state: { account, provider },
    dispatch,
  } = useAuthContext();

  const { chain } = useNetwork();

  const signer = useEthersSigner({ chainId: chain });

  useEffect(() => {
    let type = localStorage.getItem(SELECT_WALLET);
    let walletType = type ? type : 'METAMASK';
    if (account && provider) return;
    if (walletType === 'METAMASK' && signer) {
      dispatch({ type: AppActionType.SET_PROVIDER, payload: signer });
    } else if (walletType === 'UNIPASS') {
      const providerUnipass = new ethers.providers.Web3Provider(upProvider, 'any');
      dispatch({ type: AppActionType.SET_PROVIDER, payload: providerUnipass });
    } else if (walletType === 'JOYID') {
      const url = mainnet.rpcUrls.public.http[0];
      const id = mainnet.id;
      const providerJoyId = new ethers.providers.JsonRpcProvider(url, id);
      dispatch({ type: AppActionType.SET_PROVIDER, payload: providerJoyId });
    }
  }, [account, provider, chain, signer]);

  const closeModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  return (
    <>
      <Mask show={showModal}>
        <Modal>
          <span className="icon-close" onClick={() => closeModal()}>
            <X />
          </span>
          <Title>{t('general.ConnectWallet')}</Title>
          <Metamask />
          <Unipass />
          {/*<Joyid />*/}
        </Modal>
      </Mask>
    </>
  );
}

interface ShowProps {
  show: boolean;
}

const Mask = styled.div<ShowProps>`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100vw;
  height: 100vh;
  background: rgba(45, 51, 46, 0.6);
  //display: flex;
  display: ${(props) => (props.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 400px;
  height: 260px;
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
