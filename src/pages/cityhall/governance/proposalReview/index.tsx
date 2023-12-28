import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';
import { ProposalState, ISimpleProposal } from 'type/proposalV2.type';
import ClearSVGIcon from 'components/svgs/clear';
import SearchSVGIcon from 'components/svgs/search';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProposalItem from 'components/proposalCom/reviewProposalItem';
import requests from 'requests';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import NoItem from 'components/noItem';

const STATUS = [
  { name: 'Proposal.Draft', value: ProposalState.Draft },
  { name: 'Proposal.Rejected', value: ProposalState.Rejected },
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
  const [hasMore, setHasMore] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');

  const getProposalList = async (init?: boolean) => {
    //   TODO: get proposal list
    const _page = init ? 1 : page;
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

      if (_page === 1) {
        setProposalList(resp.data.rows);
      } else {
        setProposalList([...proposalList, ...resp.data.rows]);
      }
      setPage(_page + 1);
      setHasMore(resp.data.rows.length >= PAGE_SIZE);
    } catch (error) {
      logError('getAllProposals failed', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  useEffect(() => {
    getProposalList(true);
  }, [selectStatus, searchKeyword]);

  const onKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      setSearchKeyword(e.target.value);
    }
  };
  const clearSearch = () => {
    setInputKeyword('');
    setSearchKeyword('');
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
      <InfiniteScroll
        scrollableTarget="scrollableDiv"
        dataLength={proposalList.length}
        next={getProposalList}
        hasMore={hasMore}
        loader={<></>}
      >
        {proposalList.map((p) => (
          <ProposalItem key={p.id} data={p} isReview />
        ))}
        {proposalList.length === 0 && !loading && <NoItem />}
      </InfiniteScroll>
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
    border-radius: 8px;
    padding-inline: 10px;
    border: 1px solid #e5e5e5;
    cursor: pointer;
    &.selected {
      background-color: #e5e5e5;
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
  background: var(--bs-box-background);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid var(--bs-border-color);
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
