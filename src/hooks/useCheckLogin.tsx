import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useWeb3React } from '@web3-react/core';

const useCheckLogin = () => {
  const { account } = useWeb3React();

  const {
    state: { account: tokenAccount, tokenData },
    dispatch,
  } = useAuthContext();

  if (tokenData && account && tokenAccount && account.toLocaleLowerCase() !== tokenAccount.toLocaleLowerCase()) {
    dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
    return false;
  }
  return tokenData && account && account === tokenAccount;
};

export default useCheckLogin;
