import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useEffect, useState } from 'react';
import { METAFORO_TOKEN } from 'utils/constant';
import { WalletType } from 'wallet/wallet';
import publicJs from 'utils/publicJs';
import { initApiService, loginByWallet, LoginParam } from 'requests/proposal';
import useToast, { ToastType } from './useToast';
import { useTranslation } from 'react-i18next';
import { useNetwork } from 'wagmi';
import { signTypedData } from 'wagmi/actions';
import MetaforoLoginModal from 'components/modals/metaforoLoginModal';
import { prepareMetaforo } from 'requests/proposalV2';

export default function useMetaforoLogin() {
  const {
    state: { metaforoToken, wallet_type, account, userData, show_metaforo_login },
    dispatch,
  } = useAuthContext();

  const { chain } = useNetwork();

  const { t } = useTranslation();
  const { showToast } = useToast();

  useEffect(() => {
    if (!metaforoToken) {
      const data = localStorage.getItem(METAFORO_TOKEN);
      if (data) {
        try {
          const user = JSON.parse(data);
          if (user?.account === account) {
            dispatch({ type: AppActionType.SET_METAFORO_TOKEN, payload: user?.token });
            initApiService(user?.token);
          }
        } catch (error) {}
      }
    }
  }, [account]);

  const saveToken = (userid: number, value: string) => {
    localStorage.setItem(METAFORO_TOKEN, JSON.stringify({ id: userid, account, token: value }));
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
    saveToken(data.user.id, data.api_token);
    // bind user
    await prepareMetaforo();
  };

  const go2login = async () => {
    if (!account || !userData || !chain) {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
    if (wallet_type === WalletType.AA) {
      showToast(t('Proposal.NotSupportWallet', { wallet: 'UniPass' }), ToastType.Danger);
      return;
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    // sign
    try {
      console.log('[typedData] params', account, chain.id);
      const signData = publicJs.typedData(account, chain.id);
      console.log('[signData]', signData);
      // @ts-ignore
      const sign = await signTypedData(signData);
      // // @ts-ignore
      // const sign = await signTypedDataAsync(signData);
      handleLogin(sign, JSON.stringify(signData));
      dispatch({ type: AppActionType.SET_SHOW_METAFORO_LOGIN_MODAL, payload: false });
    } catch (error: any) {
      logError('login failed', error);
      showToast(error?.message || `${error}`, ToastType.Danger);
      return;
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
    return true;
  };

  const checkMetaforoLogin = async () => {
    if (!account || !userData || !chain) {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }

    if (metaforoToken) {
      return true;
    }
    dispatch({ type: AppActionType.SET_SHOW_METAFORO_LOGIN_MODAL, payload: true });
  };

  const LoginMetafoModal = () => {
    return show_metaforo_login ? (
      <MetaforoLoginModal
        onClose={() => dispatch({ type: AppActionType.SET_SHOW_METAFORO_LOGIN_MODAL, payload: false })}
        onConfirm={go2login}
      />
    ) : null;
  };

  return { checkMetaforoLogin, LoginMetafoModal };
}