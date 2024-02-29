import { useAuthContext } from 'providers/authProvider';
import useCheckLogin from 'hooks/useCheckLogin';
import { useEffect, useState } from 'react';

const usePermission = (action: string, object: string) => {
  const {
    state: { authorizer, account },
  } = useAuthContext();

  const isLogin = useCheckLogin(account);
  const [checkResult, setCheckResult] = useState(false);

  const checkLogic = async () => {
    if (isLogin && authorizer) {
      const result = await authorizer.can(action, object);
      setCheckResult(result);
    } else {
      setCheckResult(false);
    }
  };

  useEffect(() => {
    checkLogic();
  }, [isLogin, authorizer, action, object]);

  return checkResult;
};

export default usePermission;
