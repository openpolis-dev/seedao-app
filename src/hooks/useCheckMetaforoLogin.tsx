import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useEffect } from 'react';
import { METAFORO_TOKEN } from 'utils/constant';
import { WalletType } from 'wallet/wallet';
import publicJs from 'utils/publicJs';
import { initApiService, loginByWallet, LoginParam } from 'requests/proposal';
import useToast, { ToastType } from './useToast';
import { useTranslation } from 'react-i18next';
import { useNetwork, useSignTypedData } from 'wagmi';

export default function useCheckMetaforoLogin() {
  const {
    state: { metaforoToken, wallet_type, account },
    dispatch,
  } = useAuthContext();

  const { signTypedDataAsync } = useSignTypedData();
  const { chain } = useNetwork();

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
    if (!account || !chain) {
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
    try {
      const signData = publicJs.typedData(account, chain.id);
      // @ts-ignore
      const sign = await signTypedDataAsync(signData);
      handleLogin(sign, JSON.stringify(signData));
    } catch (error: any) {
      logError('login failed', error);
      showToast(error?.message || `${error}`, ToastType.Danger);
      return;
    }
    return true;
  };

  return checkMetaforoLogin;
}
