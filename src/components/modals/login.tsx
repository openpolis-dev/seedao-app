import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CloseImg from '../../assets/Imgs/dark/close-circle.svg';
import CloseImgLight from '../../assets/Imgs/light/close-circle.svg';
import { useAuthContext, AppActionType } from 'providers/authProvider';

import {
  useConnect,
  useAccount,
  useSignMessage,
  useChainId,
  useDisconnect,
  ConnectorAlreadyConnectedError,
} from 'wagmi';
import { Connector } from 'wagmi/connectors';

import MetamaskIcon from 'assets/Imgs/home/METAmask.svg';
import JoyIdImg from 'assets/Imgs/home/JOYID.png';
import UnipassIcon from 'assets/Imgs/home/UniPass.svg';
import { useEffect, useState } from 'react';
import { getNonce, login, readPermissionUrl } from 'requests/user';
import { WalletType, Wallet } from 'wallet/wallet';
import { createSiweMessage } from 'utils/sign';
import { SELECT_WALLET, SEEDAO_USER_DATA } from 'utils/constant';
import { clearStorage } from 'utils/auth';
import { Authorizer } from 'casbin.js';
import ReactGA from 'react-ga4';
import OneSignal from 'react-onesignal';
import getConfig from 'utils/envCofnig';

const networkConfig = getConfig().NETWORK;

enum CONNECTOR_ID {
  METAMASK = 'metaMask',
  JOYID = 'joyid',
  UNIPASS = 'unipass',
}

type ConnectorStatic = {
  icon: string;
  walletType: WalletType;
  wallet: Wallet; // just for compatibility old code
};

const getConnectorStatic = (id: CONNECTOR_ID): ConnectorStatic => {
  switch (id) {
    case CONNECTOR_ID.METAMASK:
      return {
        icon: MetamaskIcon,
        walletType: WalletType.EOA,
        wallet: Wallet.METAMASK_INJECTED,
      };
    case CONNECTOR_ID.JOYID:
      return {
        icon: JoyIdImg,
        walletType: WalletType.EOA,
        wallet: Wallet.JOYID_WEB,
      };
    case CONNECTOR_ID.UNIPASS:
      return {
        icon: UnipassIcon,
        walletType: WalletType.AA,
        wallet: Wallet.UNIPASS,
      };
  }
};

const LoginModalContent = () => {
  const { t } = useTranslation();

  const { connectors, isLoading: connectLoading, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage();

  const [selectConnectorId, setSelectConnectorId] = useState<CONNECTOR_ID>();
  const [loginLoading, setLoginLoading] = useState(false);

  const {
    state: { theme, loading },
    dispatch,
  } = useAuthContext();

  const [clickConnectFlag, setClickConnectFlag] = useState(false);

  useEffect(() => {
    if (connectLoading || signLoading || loginLoading) {
      if (!loading) {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
      }
    } else if (loading) {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  }, [connectLoading, signLoading, loginLoading, loading]);

  useEffect(() => {
    if (isConnected && address && clickConnectFlag) {
      const handleLogin = async (siweMessage: string, signResult: string) => {
        if (!selectConnectorId) {
          return;
        }
        setLoginLoading(true);
        try {
          const res = await login({
            wallet: address,
            message: siweMessage,
            signature: signResult,
            domain: window.location.host,
            wallet_type: getConnectorStatic(selectConnectorId)?.walletType,
            is_eip191_prefix: true,
          });
          // set context data
          const now = Date.now();
          res.data.token_exp = now + res.data.token_exp * 1000;
          dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: res.data });

          dispatch({ type: AppActionType.SET_ACCOUNT, payload: address });
          setLoginLoading(false);
          // TODO: no more need to set provider???
          // dispatch({ type: AppActionType.SET_PROVIDER, payload: provider });
          // set authorizer
          const authorizer = new Authorizer('auto', { endpoint: readPermissionUrl });
          await authorizer.setUser(address);
          dispatch({ type: AppActionType.SET_AUTHORIZER, payload: authorizer });
          dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: WalletType.EOA });
          dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
          ReactGA.event('login_success', {
            type: 'metamask',
            account: 'account:' + address,
          });
          try {
            // toLocaleLowerCase for compatibility old data
            await OneSignal.login(address.toLocaleLowerCase());
          } catch (error) {
            logError('OneSignal login error', error);
          }
        } catch (error) {
          setClickConnectFlag(false);

          // TODO: alert login error
          logError('login error', error);
          // handle login failed
          dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
          localStorage.removeItem(SEEDAO_USER_DATA);
          clearStorage();
          dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: null });
          dispatch({ type: AppActionType.SET_AUTHORIZER, payload: null });
          dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: null });
          // disconnect();
          ReactGA.event('login_failed', { type: 'metamask' });
          setLoginLoading(false);
        }
      };
      // sign message
      const handleSignAndLogin = async () => {
        // get nonce
        let nonce = '';
        try {
          const res = await getNonce(address);
          nonce = res.data.nonce;
        } catch (error) {
          // TODO: alert
          logError(error);
          setClickConnectFlag(false);

          return;
        }
        try {
          const msg = createSiweMessage(address, chainId, nonce, 'Welcome to SeeDAO!');
          const signResult = await signMessageAsync({ message: msg });
          handleLogin(msg, signResult);
        } catch (error) {
          // TODO: alert
          logError(error);
          setClickConnectFlag(false);
        }
      };
      handleSignAndLogin();
    }
  }, [isConnected, address, clickConnectFlag]);

  const closeModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  const handleClickWallet = async (connector: Connector) => {
    if (!connector.ready && connector.id === CONNECTOR_ID.METAMASK) {
      window.open('https://metamask.io/download.html', '_blank');
      return;
    } else if (!connector.ready) {
      // TODO: alert
      return;
    }
    localStorage.setItem(SELECT_WALLET, Wallet.METAMASK_INJECTED);
    setSelectConnectorId(connector.id as CONNECTOR_ID);

    // handle connect
    try {
      await connectAsync({ connector, chainId: networkConfig.chainId });
      setClickConnectFlag(true);
    } catch (error: any) {
      if (error instanceof ConnectorAlreadyConnectedError) {
        if (isConnected && address) {
          setClickConnectFlag(true);
        }
      }
      logError('=======', error, error.mesaage);
    }
  };

  const getConnectorButtonText = (connector: Connector) => {
    if (connector.ready) {
      return connector.name;
    }
    if (connector.id === CONNECTOR_ID.METAMASK) {
      return 'Install Metamask';
    }
    return 'Unsupport';
  };

  const getConnectionButtons = () => {
    return connectors.map((connector) => (
      <WalletOption onClick={() => handleClickWallet(connector)} key={connector.id}>
        <img src={getConnectorStatic(connector.id as CONNECTOR_ID)?.icon} alt="" />
        <span>{getConnectorButtonText(connector)}</span>
      </WalletOption>
    ));
  };
  return (
    <Mask show={true}>
      <Modal>
        <span className="icon-close" onClick={() => closeModal()}>
          <img src={theme ? CloseImg : CloseImgLight} alt="" />
        </span>
        <Title>{t('general.ConnectWallet')}</Title>
        {getConnectionButtons()}
      </Modal>
    </Mask>
  );
};

export default function LoginModal({ showModal }: { showModal?: boolean }) {
  if (showModal) {
    return <LoginModalContent />;
  } else {
    return null;
  }
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

const WalletOption = styled.li`
  display: flex;
  align-items: center;
  padding: 14px 28px;
  border-radius: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  background: var(--home-right);
  color: var(--bs-body-color_active);
  font-family: 'Poppins-SemiBold';
  font-weight: 600;
  font-size: 16px;
  &:hover {
    background-color: var(--home-right_hover);
  }
  img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }
`;
