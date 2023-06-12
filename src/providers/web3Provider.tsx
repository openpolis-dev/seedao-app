import { useEffect } from 'react';
import { Web3ReactProvider, Web3ReactHooks } from '@web3-react/core';
import { SELECT_WALLET } from 'utils/constant';
import { getConnectorForWallet, useConnectors } from 'wallet/connector';
import { Wallet } from 'wallet/wallet';
import type { Connector } from '@web3-react/types';

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
  const connectors = useConnectors(Wallet.METAMASK);

  useEffect(() => {
    connect(getConnectorForWallet(Wallet.METAMASK));
  }, []);

  return (
    <Web3ReactProvider connectors={[...(connectors as [Connector, Web3ReactHooks][])]}>
      {props.children}
    </Web3ReactProvider>
  );
};

export default Web3Provider;
