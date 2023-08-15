import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useWeb3React } from '@web3-react/core';

const useCheckLogin = () => {
  const { account } = useWeb3React();

  const {
    state: { account: tokenAccount, tokenData, userData },
    dispatch,
  } = useAuthContext();

  console.log(tokenData, account, userData);

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
