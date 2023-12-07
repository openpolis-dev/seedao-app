import { useEffect } from 'react';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { getCurrentSeason } from 'requests/cityHall';

export default function useCurrentSeason() {
  const {
    state: { currentSeason },
    dispatch,
  } = useAuthContext();

  useEffect(() => {
    if (!currentSeason) {
      getCurrentSeason().then((r) => {
        dispatch({ type: AppActionType.SET_CURRENT_SEASON, payload: r.data?.name });
      });
    }
  }, [currentSeason]);

  return currentSeason;
}
