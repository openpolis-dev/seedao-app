import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useEffect } from 'react';
import { METAFORO_TOKEN, SELECT_WALLET } from 'utils/constant';
import { WalletType, Wallet } from 'wallet/wallet';
import publicJs from 'utils/publicJs';
import getConfig from 'utils/envCofnig';
import { initApiService, loginByWallet, LoginParam } from 'requests/proposal';
import useToast, { ToastType } from './useToast';
import { signTypedData } from '@joyid/evm';
import { useTranslation } from 'react-i18next';

const networkConfig = getConfig().NETWORK;

export default function useCheckMetaforoLogin() {
  const {
    state: { metaforoToken, wallet_type, account, provider },
    dispatch,
  } = useAuthContext();

  const { t } = useTranslation();
  const { showToast } = useToast();

  useEffect(() => {
    if (!metaforoToken) {
      const data = localStorage.getItem(METAFORO_TOKEN);
      if (data) {
        dispatch({ type: AppActionType.SET_METAFORO_TOKEN, payload: data });
        initApiService(data);
      }
    }
  }, []);

  const saveToken = (value: string) => {
    localStorage.setItem(METAFORO_TOKEN, value);
    dispatch({ type: AppActionType.SET_METAFORO_TOKEN, payload: value });
  };

  const handleLogin = async (sign: string, signMsg: string) => {
    // login
    const loginParam = {
      web3_public_key: account,
      sign,
      signMsg,
      wallet_type: 5,
    } as LoginParam;
    const data = await loginByWallet(loginParam);
    saveToken(data.api_token);
  };

  const checkMetaforoLogin = async () => {
    // TODO: check login
    if (!account) {
      return;
    }

    if (metaforoToken) {
      return true;
    }
    if (wallet_type === WalletType.AA) {
      showToast(t('Proposal.NotSupportWallet', { wallet: 'UniPass' }), ToastType.Danger);
      return;
    }
    // sign
    const walletType = localStorage.getItem(SELECT_WALLET) as Wallet;
    try {
      if (walletType === Wallet.METAMASK_INJECTED) {
        const network = await provider.getNetwork();
        const signMsg = JSON.stringify(publicJs.typedData(account, network.chainId));
        const sign = await provider.send('eth_signTypedData_v4', [account.toLowerCase(), signMsg]);
        handleLogin(sign, signMsg);
      } else if (walletType === Wallet.JOYID_WEB) {
        const signData = publicJs.typedData(account, networkConfig.chainId);
        const sign = await signTypedData(signData, account);
        handleLogin(sign, JSON.stringify(signData));
      }
    } catch (error: any) {
      logError('login failed', error);
      showToast(error?.message || `${error}`, ToastType.Danger);
      return;
    }
    return true;
  };

  return checkMetaforoLogin;
}
