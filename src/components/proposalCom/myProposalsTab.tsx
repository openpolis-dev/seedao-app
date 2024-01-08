import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import SimpleProposalItem, { TabType } from 'components/proposalCom/simpleProposalItem';
import { ISimpleProposal, ProposalState } from 'type/proposalV2.type';
import useQuerySNS from 'hooks/useQuerySNS';
import publicJs from 'utils/publicJs';
import Pagination from 'components/pagination';
import NoItem from 'components/noItem';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { getMyProposalList } from 'requests/proposalV2';
import useToast, { ToastType } from 'hooks/useToast';

const PAGE_SIZE = 10;

export default function MyProposalsTab({ tab }: { tab?: TabType }) {
  const { t } = useTranslation();
  const {
    state: { loading },
    dispatch,
  } = useAuthContext();

  const [proposalList, setProposalList] = useState<ISimpleProposal[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentTab, setCurrentTab] = useState(tab || TabType.Submitted);

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
        currentTab === TabType.UnSubmitted,
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
  }, [currentTab]);

  return (
    <>
      <StatusBox>
        <li
          className={currentTab === TabType.Submitted ? 'selected' : ''}
          onClick={() => setCurrentTab(TabType.Submitted)}
        >
          {t('Proposal.NotPendingCommit')}
        </li>
        <li
          className={currentTab === TabType.UnSubmitted ? 'selected' : ''}
          onClick={() => setCurrentTab(TabType.UnSubmitted)}
        >
          {t('Proposal.PendingCommit')}
        </li>
      </StatusBox>
      <div>
        {proposalList.map((p) => (
          <SimpleProposalItem
            key={p.id}
            data={p}
            sns={formatSNS(p.applicant?.toLocaleLowerCase())}
            currentTab={[TabType.My, currentTab]}
          />
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
  gap: 40px;
  margin-bottom: 20px;
  //padding-left: 23px;
  li {
    //height: 40px;
    //padding-inline: 10px;
    //line-height: 40px;
    //background-color: var(--bs-background);
    //border-radius: 100px;
    font-size: 14px;

    cursor: pointer;
    color: var(--bs-body-color);
    //min-width: 104px;
    box-sizing: border-box;
    //border: 1px solid var(--bs-background);

    &.selected,
    &:hover {
      color: var(--bs-body-color_active);
      //background-color: var(--bs-primary);
      //color: #fff;
    }
  }
`;
