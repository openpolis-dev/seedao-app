import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import SeeSelect from 'components/common/select';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ClearSVGIcon from 'components/svgs/clear';
import SearchSVGIcon from 'components/svgs/search';
import { Button } from 'react-bootstrap';
import SimpleProposalItem from 'components/proposalCom/simpleProposalItem';
import { Link, useNavigate } from 'react-router-dom';
import HistoryAction from 'components/proposalCom/historyAction';
import requests from 'requests';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { ISimpleProposal, ProposalState } from 'type/proposalV2.type';
import useProposalCategories from 'hooks/useProposalCategories';
import NoItem from 'components/noItem';
import useQuerySNS from 'hooks/useQuerySNS';
import publicJs from 'utils/publicJs';
import Pagination from 'components/pagination';
import SearchImg from '../../assets/Imgs/proposal/search.svg';
import AddImg from '../../assets/Imgs/proposal/add-square.svg';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';

const PAGE_SIZE = 10;

export default function ProposalIndexPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    state: { loading },
    dispatch,
  } = useAuthContext();
  const proposalCategories = useProposalCategories();
  // filter category
  const CATEGORY_OPTIONS: ISelectItem[] = proposalCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  // filter time
  const TIME_OPTIONS: ISelectItem[] = [
    { value: 'desc', label: t('Proposal.TheNeweset') },
    { value: 'asc', label: t('Proposal.TheOldest') },
  ];
  // filter status
  const STATUS_OPTIONS: ISelectItem[] = [
    { value: ProposalState.Voting, label: t('Proposal.Voting') },
    { value: ProposalState.Draft, label: t('Proposal.Draft') },
    { value: ProposalState.Rejected, label: t('Proposal.Rejected') },
    { value: ProposalState.Withdrawn, label: t('Proposal.WithDrawn') },
    { value: ProposalState.VotingPassed, label: t('Proposal.Passed') },
    { value: ProposalState.VotingFailed, label: t('Proposal.Failed') },
  ];

  const [selectCategory, setSelectCategory] = useState<ISelectItem>();
  const [selectTime, setSelectTime] = useState<ISelectItem>(TIME_OPTIONS[0]);
  const [selectStatus, setSelectStatus] = useState<ISelectItem>();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');

  const [proposalList, setProposalList] = useState<ISimpleProposal[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [initPage, setInitPage] = useState(true);

  const { checkMetaforoLogin } = useCheckMetaforoLogin();
  const { getMultiSNS } = useQuerySNS();

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
        sort_order: selectTime.value,
        sort_field: 'create_ts',
        state: selectStatus?.value,
        category_id: selectCategory?.value,
        q: searchKeyword,
      });
      setProposalList(resp.data.rows);
      handleSNS(resp.data.rows.filter((d) => !!d.applicant).map((d) => d.applicant));
      setTotalCount(resp.data.total);
    } catch (error) {
      logError('getAllProposals failed', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    if (!initPage) {
      getProposalList();
      setShowHistory(false);
      setPage(1);
    }
  }, [selectCategory, selectTime, selectStatus, searchKeyword]);

  useEffect(() => {
    initPage && getProposalList();
    setInitPage(false);
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

  const handleClickHistory = async () => {
    const canOpen = await checkMetaforoLogin();
    if (canOpen) {
      setShowHistory(true);
    }
  };

  const go2create = async () => {
    const canCreate = await checkMetaforoLogin();
    if (canCreate) {
      navigate('/proposal-v2/create');
    }
  };

  return (
    <Page>
      <OperateBox>
        <LineBox>
          <HistoryButton className={!showHistory ? 'selected' : ''} onClick={() => setShowHistory(false)}>
            {t('Proposal.all')}
          </HistoryButton>
          <HistoryButton className={showHistory ? 'selected' : ''} onClick={handleClickHistory}>
            {t('Proposal.HistoryRecord')}
          </HistoryButton>
        </LineBox>
      </OperateBox>
      {showHistory ? (
        <HistoryAction />
      ) : (
        <>
          <FlexLine>
            <FilterBox>
              <SeeSelect
                width="180px"
                options={CATEGORY_OPTIONS}
                isSearchable={false}
                placeholder={t('Proposal.TypeSelectHint')}
                onChange={(v: ISelectItem) => setSelectCategory(v)}
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
                {/*<SearchSVGIcon />*/}
                <img src={SearchImg} alt="" className="iconBg" />
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
            <Button variant="primary" onClick={go2create}>
              <img src={AddImg} alt="" className="mr20" />
              {t('Proposal.CreateProposal')}
            </Button>
          </FlexLine>
          {proposalList.map((p) => (
            <SimpleProposalItem key={p.id} data={p} sns={formatSNS(p.applicant?.toLocaleLowerCase())} />
          ))}
          {totalCount === 0 && !loading && <NoItem />}
          {totalCount > PAGE_SIZE && (
            <div>
              <Pagination itemsPerPage={PAGE_SIZE} total={totalCount} current={page - 1} handleToPage={go2page} />
            </div>
          )}
        </>
      )}
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
  .mr20 {
    margin-right: 10px;
  }
`;

const OperateBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 20px;
`;

const FilterBox = styled.div`
  display: flex;
  gap: 16px;
`;

const SearchBox = styled.div`
  background: var(--bs-background);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border: 1px solid var(--bs-border-color);
  position: relative;
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
  border-radius: 100px;
  font-size: 14px;
  text-align: center;
  color: var(--bs-body-color_active);
  cursor: pointer;
  margin-right: 10px;

  &.selected {
    background-color: var(--bs-primary);
    color: #fff;
  }
`;

const LineBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const FlexLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 20px;
`;
