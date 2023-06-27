import { useAuthContext } from 'providers/authProvider';
import useCheckLogin from 'hooks/useCheckLogin';
import { useEffect, useState } from 'react';

const usePermission = (action: string, object: string) => {
  const isLogin = useCheckLogin();
  const {
    state: { authorizer },
  } = useAuthContext();

  const [checkResult, setCheckResult] = useState(false);

  const checkLogic = async () => {
    if (isLogin && authorizer) {
      const result = await authorizer.can(object, action);
      setCheckResult(result);
    } else {
      setCheckResult(false);
    }
  };

  useEffect(() => {
    checkLogic();
  }, [isLogin, authorizer]);

  return checkResult;
};

export default usePermission;
