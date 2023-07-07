import React, { useEffect } from 'react';
import { Web3ReactProvider, Web3ReactHooks } from '@web3-react/core';
import { getConnectorForWallet, useConnectors } from 'wallet/connector';
import type { Connector } from '@web3-react/types';
import { SELECT_WALLET } from 'utils/constant';
import { Wallet, WalletType } from 'wallet/wallet';
import { AppActionType, useAuthContext } from './authProvider';
import { parseToken, checkTokenValid } from 'utils/auth';
import { SEEDAO_USER } from 'utils/constant';

const connect = async (connector: any) => {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly();
    } else {
      await connector.activate();
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`);
  }
};

const Web3Provider: React.FC<{ children: React.ReactNode }> = (props) => {
  const connectors = useConnectors();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const tokenDataStr = localStorage.getItem(SEEDAO_USER) || '';
    const tokenData = parseToken(tokenDataStr);
    if (checkTokenValid(tokenData?.token, tokenData?.token_exp)) {
      const selectWallet = localStorage.getItem(SELECT_WALLET) as Wallet;
      let wallet_type: WalletType;
      switch (selectWallet) {
        case Wallet.METAMASK:
          wallet_type = WalletType.EOA;
          break;
        case Wallet.UNIPASS:
          wallet_type = WalletType.AA;
          break;
      }
      dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: wallet_type });
      selectWallet && connect(getConnectorForWallet(selectWallet));
    }
  }, []);

  return (
    <Web3ReactProvider connectors={[...(connectors as [Connector, Web3ReactHooks][])]}>
      {props.children}
    </Web3ReactProvider>
  );
};

export default Web3Provider;
