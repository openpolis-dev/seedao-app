import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useWeb3React } from '@web3-react/core';

const useCheckLogin = () => {
  const { account } = useWeb3React();

  const {
    state: { account: tokenAccount, userData },
    dispatch,
  } = useAuthContext();

  if (userData && account && account !== tokenAccount) {
    dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
    return false;
  }
  return userData && account && account === tokenAccount;
};

export default useCheckLogin;
