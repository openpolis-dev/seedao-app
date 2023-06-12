import { MetaMask } from '@web3-react/metamask';
import { initializeConnector } from '@web3-react/core';
import { useMemo } from 'react';
import { Wallet } from './wallet';

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

export const [injected, injectedHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions, onError }));

export const connectors = [[injected, injectedHooks]];

export const getConnectorForWallet = (wallet: Wallet) => {
  switch (wallet) {
    case Wallet.METAMASK:
      return injected;
    default:
      return;
  }
};

function getHooksForWallet(wallet: Wallet) {
  switch (wallet) {
    case Wallet.METAMASK:
      return injectedHooks;

    default:
      return;
  }
}

function getConnectorListItemForWallet(wallet: Wallet) {
  return {
    connector: getConnectorForWallet(wallet),
    hooks: getHooksForWallet(wallet),
  };
}
export const SELECTABLE_WALLETS = [Wallet.METAMASK];

export const useConnectors = (selectedWallet: Wallet | null) => {
  return useMemo(() => {
    const connectors = [];
    if (selectedWallet) {
      connectors.push(getConnectorListItemForWallet(selectedWallet));
    }
    connectors.push(
      ...SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet).map(getConnectorListItemForWallet),
    );
    const web3ReactConnectors = connectors.map(({ connector, hooks }) => [connector, hooks]);
    return web3ReactConnectors;
  }, [selectedWallet]);
};
