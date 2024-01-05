import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import SimpleProposalItem from 'components/proposalCom/simpleProposalItem';
import { ISimpleProposal, ProposalState } from 'type/proposalV2.type';
import useQuerySNS from 'hooks/useQuerySNS';
import publicJs from 'utils/publicJs';
import Pagination from 'components/pagination';
import NoItem from 'components/noItem';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { getMyProposalList } from 'requests/proposalV2';
import useToast, { ToastType } from 'hooks/useToast';

const PAGE_SIZE = 10;

export default function MyProposalsTab() {
  const { t } = useTranslation();
  const {
    state: { loading },
    dispatch,
  } = useAuthContext();

  const [selectPendingSubmit, setSelectPendingSubmit] = useState(false);

  const [proposalList, setProposalList] = useState<ISimpleProposal[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { getMultiSNS } = useQuerySNS();
  const { showToast } = useToast();

  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const handleSNS = async (wallets: string[]) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };

  const getProposalList = async (_page: number = 1) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await getMyProposalList(
        {
          page: _page,
          size: PAGE_SIZE,
          sort_order: 'desc',
          sort_field: 'create_ts',
        },
        selectPendingSubmit,
      );
      setProposalList(resp.data.rows);
      handleSNS(resp.data.rows.filter((d) => !!d.applicant).map((d) => d.applicant));
      setTotalCount(resp.data.total);
    } catch (error: any) {
      logError('getAllProposals failed', error);
      showToast(error?.code || error, ToastType.Danger, { autoClose: false });
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const go2page = (_page: number) => {
    setPage(_page + 1);
    getProposalList(_page + 1);
  };

  useEffect(() => {
    getProposalList(1);
  }, [selectPendingSubmit]);

  return (
    <>
      <StatusBox>
        <li className={selectPendingSubmit ? '' : 'selected'} onClick={() => setSelectPendingSubmit(false)}>
          {t('Proposal.NotPendingCommit')}
        </li>
        <li className={selectPendingSubmit ? 'selected' : ''} onClick={() => setSelectPendingSubmit(true)}>
          {t('Proposal.PendingCommit')}
        </li>
      </StatusBox>
      <div>
        {proposalList.map((p) => (
          <SimpleProposalItem key={p.id} data={p} sns={formatSNS(p.applicant?.toLocaleLowerCase())} />
        ))}
        {totalCount === 0 && !loading && <NoItem />}
        {totalCount > PAGE_SIZE && (
          <div>
            <Pagination itemsPerPage={PAGE_SIZE} total={totalCount} current={page - 1} handleToPage={go2page} />
          </div>
        )}
      </div>
    </>
  );
}

const StatusBox = styled.ul`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  li {
    height: 40px;
    padding-inline: 20px;
    line-height: 40px;
    background-color: var(--bs-background);
    border-radius: 100px;
    font-size: 14px;
    text-align: center;
    color: var(--bs-body-color_active);
    cursor: pointer;
    margin-right: 10px;
    min-width: 104px;

    &.selected {
      background-color: var(--bs-primary);
      color: #fff;
    }
  }
`;
