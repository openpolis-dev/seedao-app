import { useAuthContext, AppActionType } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';
import CloseImg from '../../assets/Imgs/dark/close-circle.svg';
import CloseImgLight from '../../assets/Imgs/light/close-circle.svg';

import WalletConnect from '../login/walletconnect';
import Metamask from '../login/metamask';
import UniPass, { upProvider } from '../login/unipass';
import Joyid from '../login/joyid';
import JoyidWeb, { initJoyId } from 'components/login/joyidWeb';

import { useNetwork } from 'wagmi';
import { useEthersProvider, useEthersSigner } from '../login/ethersNew';
import { SELECT_WALLET } from '../../utils/constant';
import { ethers } from 'ethers';
import getConfig from 'utils/envCofnig';
import useCheckInstallPWA from 'hooks/useCheckInstallPWA';
import { Wallet } from 'wallet/wallet';
import publicJs from 'utils/publicJs';

export default function LoginModal({ showModal }: any) {
  const { t } = useTranslation();
  const network = getConfig().NETWORK;

  const {
    state: { account, provider, theme },
    dispatch,
  } = useAuthContext();

  const { chain } = useNetwork();

  const walletconnect_provider = useEthersProvider({ chainId: chain });
  const isInstalled = useCheckInstallPWA();
  const [handledProvider, setHandledProvider] = useState(false);

  const chooseRPC = async () => {
    const _rpc = await publicJs.checkRPCavailable(network.rpcs, {
      chainId: network.chainId,
      name: network.name,
    });
    dispatch({ type: AppActionType.SET_RPC, payload: _rpc });
    return _rpc;
  };

  const handleUnipassProvider = async () => {
    if (handledProvider) {
      return;
    }
    setHandledProvider(true);
    try {
      await upProvider.connect();
      const providerUnipass = new ethers.providers.Web3Provider(upProvider, 'any');
      dispatch({ type: AppActionType.SET_PROVIDER, payload: providerUnipass });
    } catch (error) {
      setHandledProvider(false);
    }
  };

  const handleJoyidProvider = async () => {
    if (handledProvider) {
      return;
    }
    setHandledProvider(true);
    try {
      const _rpc = await chooseRPC();
      const provider = new ethers.providers.JsonRpcProvider(_rpc, network);
      dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });
    } catch (error) {
      const provider = new ethers.providers.JsonRpcProvider(network.rpcs[0], network);
      dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });
    } 
  };

  const handleProvider = (checkProvider = true) => {
    let type = localStorage.getItem(SELECT_WALLET);
    let walletType = type as Wallet;

    if (checkProvider && provider) return;
    if (walletType === Wallet.METAMASK_INJECTED && window.ethereum) {
      // metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });
    } else if (walletType === Wallet.METAMASK && walletconnect_provider) {
      // metamask in walletconnect
      dispatch({ type: AppActionType.SET_PROVIDER, payload: walletconnect_provider });
    } else if (walletType === Wallet.UNIPASS) {
      // unipass
      handleUnipassProvider();
    } else if ([Wallet.JOYID, Wallet.JOYID_WEB].includes(walletType)) {
      // joyid
      initJoyId();
      handleJoyidProvider();
    }
  };

  useEffect(() => {
    const walletType = localStorage.getItem(SELECT_WALLET) as Wallet;
    if (walletType) {
      chooseRPC();
    }
  }, []);

  useEffect(() => {
    handleProvider();
  }, [account, provider, chain, walletconnect_provider]);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleProviderEvents = () => {
      handleProvider(false);
      chooseRPC();
    };
    const initProvider = async () => {
      const { ethereum } = window as any;
      ethereum?.on('chainChanged', handleProviderEvents);
    };
    initProvider();
    return () => {
      const { ethereum } = window as any;
      ethereum?.removeListener('chainChanged', handleProviderEvents);
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
          <UniPass />
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
    right: 10px;
    top: 5px;
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
