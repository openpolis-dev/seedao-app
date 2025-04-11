import { AppActionType, useAuthContext } from 'providers/authProvider';

const useCheckLogin = (account?: string) => {
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
  return !!(tokenData?.token && account && account === tokenAccount);
};

export default useCheckLogin;
