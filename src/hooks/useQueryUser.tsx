import { AppActionType, useAuthContext } from 'providers/authProvider';
import requests from 'requests';

export default function useQueryUser() {
  const {
    state: { userMap },
    dispatch,
  } = useAuthContext();

  const getUsers = async (wallets: string[]) => {
    const _wallets = wallets.map((w) => w.toLocaleLowerCase());
    const _to_be_queried = _wallets.filter((w) => !userMap.get(w));

    const _userMap = new Map(userMap);
    if (_to_be_queried.length) {
      try {
        requests.user.getUsers(_to_be_queried).then((data) => {
          data.data.forEach((d) => {
            _userMap.set(d.wallet!.toLocaleLowerCase(), d);
          });
        });
      } catch (error) {
        console.log(error);
      }
    }

    dispatch({ type: AppActionType.SET_USER_MAP, payload: _userMap });
  };

  return { getUsers, userMap };
}
