import { useAuthContext, AppActionType } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';
import CloseImg from '../../assets/Imgs/dark/close-circle.svg';
import CloseImgLight from '../../assets/Imgs/light/close-circle.svg';

import WalletConnect from '../login/walletconnect';
import Metamask from '../login/metamask';
import Unipass, { upProvider } from '../login/unipass';
import Joyid from '../login/joyid';
import JoyidWeb from 'components/login/joyidWeb';

import { useNetwork } from 'wagmi';
import { useEthersProvider, useEthersSigner } from '../login/ethersNew';
import { SELECT_WALLET } from '../../utils/constant';
import { ethers } from 'ethers';
import { mainnet } from 'wagmi/chains';
import getConfig from 'utils/envCofnig';
import useCheckInstallPWA from 'hooks/useCheckInstallPWA';
import { Wallet } from 'wallet/wallet';

export default function LoginModal({ showModal }: any) {
  const { t } = useTranslation();

  const {
    state: { account, provider, theme },
    dispatch,
  } = useAuthContext();

  const { chain } = useNetwork();

  const walletconnect_provider = useEthersProvider({ chainId: chain });
  const isInstalled = useCheckInstallPWA();

  const handleProvider = () => {
    let type = localStorage.getItem(SELECT_WALLET);
    let walletType = type as Wallet;

    if (account && provider) return;
    if (walletType === Wallet.METAMASK_INJECTED && window.ethereum) {
      // metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });
    } else if (walletType === Wallet.METAMASK && walletconnect_provider) {
      // metamask in walletconnect
      dispatch({ type: AppActionType.SET_PROVIDER, payload: walletconnect_provider });
    } else if (walletType === Wallet.UNIPASS) {
      // unipass
      const providerUnipass = new ethers.providers.Web3Provider(upProvider, 'any');
      dispatch({ type: AppActionType.SET_PROVIDER, payload: providerUnipass });
    } else if ([Wallet.JOYID, Wallet.JOYID_WEB].includes(walletType)) {
      // joyid
      const url = mainnet.rpcUrls.public.http[0];
      const id = mainnet.id;
      const providerJoyId = new ethers.providers.JsonRpcProvider(url, id);
      dispatch({ type: AppActionType.SET_PROVIDER, payload: providerJoyId });
    }
  };

  useEffect(() => {
    handleProvider();
  }, [account, provider, chain, walletconnect_provider]);

  useEffect(() => {
    if (!window.ethereum) return;
    const initProvider = async () => {
      const { ethereum } = window as any;
      ethereum?.on('chainChanged', handleProvider);
    };
    initProvider();
    return () => {
      const { ethereum } = window as any;
      ethereum?.removeListener('chainChanged', handleProvider);
    };
  });

  const closeModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  return (
    <>
      <Mask show={showModal}>
        <Modal>
          <span className="icon-close" onClick={() => closeModal()}>
            <img src={theme ? CloseImg : CloseImgLight} alt="" />
          </span>
          <Title>{t('general.ConnectWallet')}</Title>
          {isInstalled ? <WalletConnect /> : <Metamask />}
          {getConfig().REACT_APP_JOYID_ENABLE && (isInstalled ? <Joyid /> : <JoyidWeb />)}
          <Unipass />
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
  background: var(--mask-bg);
  //display: flex;
  display: ${(props) => (props.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 427px;
  min-height: 354px;
  opacity: 1;
  border-radius: 16px;
  background: var(--bs-background);
  border: 1px solid var(--bs-border-color);
  padding: 40px 65px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .icon-close {
    position: absolute;
    right: -50px;
    top: 10px;
    cursor: pointer;
    font-size: 24px;
  }
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 38px;
  font-family: 'Poppins-Bold';
  color: var(--bs-body-color_active);
`;
