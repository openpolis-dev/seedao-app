import { AppActionType, useAuthContext } from 'providers/authProvider';
// import { useWeb3React } from '@web3-react/core';

const useCheckLogin = (account?: string) => {
  // const { account } = useWeb3React();

  // const account ="0x183F09C3cE99C02118c570e03808476b22d63191";

  const {
    state: { account: tokenAccount, tokenData, userData },
    dispatch,
  } = useAuthContext();

  if (tokenData?.token && account && tokenAccount && account.toLocaleLowerCase() !== tokenAccount.toLocaleLowerCase()) {
    dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
    return false;
  }
  if (account && userData && userData.wallet && userData.wallet.toLowerCase() !== account.toLowerCase()) {
    dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
    return false;
  }
  return tokenData?.token && account && account === tokenAccount;
};

export default useCheckLogin;
