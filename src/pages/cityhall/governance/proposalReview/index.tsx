import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';
import { ProposalState, ISimpleProposal } from 'type/proposalV2.type';
import ClearSVGIcon from 'components/svgs/clear';
import SearchSVGIcon from 'components/svgs/search';
import ReviewProposalItem from 'components/proposalCom/reviewProposalItem';
import requests from 'requests';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import NoItem from 'components/noItem';
import useQuerySNS from 'hooks/useQuerySNS';
import publicJs from 'utils/publicJs';
import Pagination from 'components/pagination';
import useToast, { ToastType } from "../../../../hooks/useToast";

const STATUS = [
  { name: 'Proposal.Draft', value: ProposalState.Draft },
  { name: 'Proposal.Discard', value: ProposalState.Rejected },
  { name: 'Proposal.WithDrawn', value: ProposalState.Withdrawn },
];

const PAGE_SIZE = 10;

export default function ProposalReview() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { loading },
  } = useAuthContext();

  const [selectStatus, setSelectStatus] = useState<ProposalState>(ProposalState.Draft);
  const [proposalList, setProposalList] = useState<ISimpleProposal[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [initPage, setInitPage] = useState(true);

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
      const resp = await requests.proposalV2.getProposalList({
        page: _page,
        size: PAGE_SIZE,
        sort_field: 'create_ts',
        sort_order: 'desc',
        state: selectStatus,
        q: searchKeyword,
      });
      setTotalCount(resp.data.total);
      setProposalList(resp.data.rows);
      handleSNS(resp.data.rows.filter((d) => !!d.applicant).map((d) => d.applicant));
    } catch (error:any) {
      logError('getAllProposals failed', error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  useEffect(() => {
    if (!initPage) {
      getProposalList(1);
      setPage(1);
    }
  }, [selectStatus, searchKeyword]);

  useEffect(() => {
    setInitPage(false);
    initPage && getProposalList();
  }, [page]);

  const onKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      setSearchKeyword(e.target.value);
    }
  };
  const clearSearch = () => {
    setInputKeyword('');
    setSearchKeyword('');
  };

  const go2page = (_page: number) => {
    setPage(_page + 1);
    getProposalList(_page + 1);
  };
  return (
    <Page>
      <BackerNav title={t('city-hall.ReviewProposal')} to="/city-hall/governance" mb="20px" />
      <FilterBox>
        <StatusBox>
          {STATUS.map((item) => (
            <li
              key={item.value}
              onClick={() => setSelectStatus(item.value)}
              className={selectStatus === item.value ? 'selected' : ''}
            >
              {t(item.name as any)}
            </li>
          ))}
        </StatusBox>
        <SearchBox>
          <SearchSVGIcon />
          <input
            type="text"
            placeholder=""
            onKeyUp={(e) => onKeyUp(e)}
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
          />
          {inputKeyword && <ClearSVGIcon onClick={() => clearSearch()} className="btn-clear" />}
        </SearchBox>
      </FilterBox>
      {proposalList.map((p) => (
        <ReviewProposalItem
          key={p.id}
          data={p}
          isReview={selectStatus === ProposalState.Draft}
          sns={formatSNS(p.applicant?.toLocaleLowerCase())}
        />
      ))}
      {totalCount === 0 && !loading && <NoItem />}
      {totalCount > PAGE_SIZE && (
        <div>
          <Pagination itemsPerPage={PAGE_SIZE} total={totalCount} current={page - 1} handleToPage={go2page} />
        </div>
      )}
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;

const StatusBox = styled.ul`
  display: flex;
  gap: 10px;
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
    border: 1px solid var(--bs-background);
    &.selected {
      background-color: var(--bs-primary);
      color: #fff;
    }
    &:hover {
      border: 1px solid var(--bs-border-color);
    }
  }
`;

const FilterBox = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchBox = styled.div`
  background: var(--bs-background);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border: 1px solid var(--bs-border-color);
  position: relative;
  height: 40px;
  &:hover {
    border-color: hsl(0, 0%, 70%);
  }
  input {
    flex: 1;
    border: 0;
    background: transparent;
    margin-left: 9px;
    height: 24px;
    &::placeholder {
      color: var(--bs-body-color);
    }
    &:focus {
      outline: none;
    }
  }
  svg.btn-clear {
    cursor: pointer;
  }
`;
