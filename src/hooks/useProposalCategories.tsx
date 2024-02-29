import { useEffect } from 'react';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { getProposalCategoryList } from 'requests/proposalV2';

export default function useProposalCategories() {
  const {
    state: { proposalCategories },
    dispatch,
  } = useAuthContext();

  useEffect(() => {
    const getProposalCategories = async () => {
      try {
        const resp = await getProposalCategoryList();
        const _list = resp.data || [];
        _list.sort((a, b) => a.name.localeCompare(b.name));
        dispatch({ type: AppActionType.SET_PROPOSAL_CATEGORIES_V2, payload: _list });
      } catch (error) {
        logError('getProposalCategories failed', error);
      }
    };
    proposalCategories !== undefined || getProposalCategories();
  }, [proposalCategories]);

  return proposalCategories;
}
