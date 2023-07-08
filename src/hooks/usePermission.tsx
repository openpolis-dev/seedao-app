import { useAuthContext } from 'providers/authProvider';
import useCheckLogin from 'hooks/useCheckLogin';
import { useEffect, useState } from 'react';
import { isNotOnline } from 'utils/index';

const usePermission = (action: string, object: string) => {
  const isLogin = useCheckLogin();
  const {
    state: { authorizer },
  } = useAuthContext();

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
  }, [isLogin, authorizer]);

  if (isNotOnline()) {
    console.log(`==========${action}, ${object}==========`);
    console.log('authorizer', authorizer);
    console.log('isLogin', isLogin);
    console.log('checkResult', checkResult);
  }

  return checkResult;
};

export default usePermission;
