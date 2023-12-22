import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import { IBaseProposal, ProposalStatus, PROPOSAL_TYPES, PROPOSAL_TIME } from 'type/proposal.type';
import SeeSelect from 'components/common/select';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ClearSVGIcon from 'components/svgs/clear';
import SearchSVGIcon from 'components/svgs/search';
import { Button } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProposalItem from 'components/proposalCom/proposalItem';
import { Link } from 'react-router-dom';
import HistoryAction from 'components/proposalCom/historyAction';
import requests from 'requests';
import { useAuthContext, AppActionType } from 'providers/authProvider';

const PAGE_SIZE = 10;

export default function ProposalIndexPage() {
  const { t } = useTranslation();
  const { state, dispatch } = useAuthContext();
  // filter types
  const TYPE_OPTIONS: ISelectItem[] = PROPOSAL_TYPES.map((tp) => ({
    value: tp.id,
    label: t(tp.name as any),
  }));
  // filter time
  const TIME_OPTIONS: ISelectItem[] = [
    { value: 'latest', label: t('Proposal.TheNeweset') },
    { value: 'old', label: t('Proposal.TheOldest') },
  ];
  // filter status
  const STATUS_OPTIONS: ISelectItem[] = [
    { value: ProposalStatus.Voting, label: t('Proposal.Voting') },
    { value: ProposalStatus.Draft, label: t('Proposal.Draft') },
    { value: ProposalStatus.Rejected, label: t('Proposal.Rejected') },
    { value: ProposalStatus.WithDrawn, label: t('Proposal.WithDrawn') },
    { value: ProposalStatus.End, label: t('Proposal.End') },
  ];

  const [selectType, setSelectType] = useState<ISelectItem>();
  const [selectTime, setSelectTime] = useState<ISelectItem>(TIME_OPTIONS[0]);
  const [selectStatus, setSelectStatus] = useState<ISelectItem>();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');

  const [proposalList, setProposalList] = useState<IBaseProposal[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const getProposalList = async (init?: boolean) => {
    //   TODO: get proposal list
    const _page = init ? 1 : page;
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await requests.proposal.getAllProposals({
        page: _page,
        per_page: PAGE_SIZE,
        sort: selectTime.value,
      });
      setProposalList([...proposalList, ...resp.data.threads]);
      setPage(_page + 1);
      setHasMore(resp.data.threads.length >= PAGE_SIZE);
    } catch (error) {
      console.error('getAllProposals failed', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    getProposalList(true);
    setShowHistory(false);
  }, [selectType, selectTime, selectStatus, searchKeyword]);

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
      <OperateBox>
        <FilterBox>
          <SeeSelect
            width="180px"
            options={TYPE_OPTIONS}
            isSearchable={false}
            placeholder={t('Proposal.TypeSelectHint')}
            onChange={(v: ISelectItem) => setSelectType(v)}
          />
          <SeeSelect
            width="120px"
            options={TIME_OPTIONS}
            defaultValue={TIME_OPTIONS[0]}
            isClearable={false}
            isSearchable={false}
            onChange={(v: ISelectItem) => setSelectTime(v)}
          />
          <SeeSelect
            width="120px"
            options={STATUS_OPTIONS}
            isSearchable={false}
            placeholder={t('Proposal.StatusSelectHint')}
            onChange={(v: ISelectItem) => setSelectStatus(v)}
          />
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
          <HistoryButton className={showHistory ? 'selected' : ''} onClick={() => setShowHistory(true)}>
            {t('Proposal.HistoryRecord')}
          </HistoryButton>
        </FilterBox>
        <Link to="/proposal-v2/create">
          <Button variant="primary">{t('Proposal.CreateProposal')}</Button>
        </Link>
      </OperateBox>
      {showHistory ? (
        <HistoryAction />
      ) : (
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          dataLength={proposalList.length}
          next={getProposalList}
          hasMore={hasMore}
          loader={<></>}
        >
          {proposalList.map((p) => (
            <ProposalItem key={p.id} data={p} />
          ))}
        </InfiniteScroll>
      )}
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;

const OperateBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const FilterBox = styled.div`
  display: flex;
  gap: 16px;
`;

const SearchBox = styled.div`
  width: 180px;
  background: var(--bs-background);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border: 1px solid var(--bs-border-color);
  &:hover {
    border-color: hsl(0, 0%, 70%);
  }
  input {
    border: 0;
    background: transparent;
    margin-left: 9px;
    height: 24px;
    flex: 1;
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

const HistoryButton = styled.div`
  height: 40px;
  padding-inline: 20px;
  line-height: 40px;
  background-color: var(--bs-background);
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
  text-align: center;
  color: var(--bs-body-color_active);
  cursor: pointer;
  &:hover {
    border-color: hsl(0, 0%, 70%);
  }
  &.selected {
    background-color: var(--bs-body-color);
  }
`;
