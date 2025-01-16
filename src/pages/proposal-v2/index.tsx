import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import SeeSelect from 'components/common/select';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ClearSVGIcon from 'components/svgs/clear';
import { Button } from 'react-bootstrap';
import SimpleProposalItem, { TabType } from 'components/proposalCom/simpleProposalItem';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
import MyProposalsTab from 'components/proposalCom/myProposalsTab';
import { useNetwork } from "wagmi";
import useToast, { ToastType } from "../../hooks/useToast";
import { SEEDAO_USER } from "../../utils/constant";

const PAGE_SIZE = 10;
let RESULT_ID = 0;

export default function ProposalIndexPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const {
    state: { loading,metaforoToken,account, userData },
    dispatch,
  } = useAuthContext();
  const proposalCategories = useProposalCategories();
  // filter category
  const CATEGORY_OPTIONS: ISelectItem[] =
    proposalCategories?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || [];
  // filter time
  const TIME_OPTIONS: ISelectItem[] = [
    { value: 'desc', label: t('Proposal.TheNeweset') },
    { value: 'asc', label: t('Proposal.TheOldest') },
  ];
  // filter status
  const STATUS_OPTIONS: ISelectItem[] = [
    { value: ProposalState.Draft, label: t('Proposal.Draft') },
    { value: ProposalState.Voting, label: t('Proposal.Voting') },
    { value: ProposalState.PendingExecution, label: t('Proposal.PendingExecution') },
    { value: ProposalState.Rejected, label: t('Proposal.Discard') },
    { value: ProposalState.Withdrawn, label: t('Proposal.WithDrawn') },
    { value: ProposalState.Executed, label: t('Proposal.Passed') },
    { value: ProposalState.VotingFailed, label: t('Proposal.Failed') },
    { value: ProposalState.Vetoed, label: t('Proposal.Vetoed') },
    { value: ProposalState.ExecutionFailed, label: t('Proposal.ExecutedFailed') },
  ];

  const [selectCategory, setSelectCategory] = useState<ISelectItem>();
  const [selectTime, setSelectTime] = useState<ISelectItem>(TIME_OPTIONS[0]);
  const [selectStatus, setSelectStatus] = useState<ISelectItem>();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');

  const [proposalList, setProposalList] = useState<ISimpleProposal[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [initPage, setInitPage] = useState(true);
  const [isFilterSIP, setIsFilterSIP] = useState(false);

  const [currentTab, setCurrentTab] = useState(state?.currentTab?.[0] || TabType.All);
  const secondTab = state?.currentTab?.[1];

  const { checkMetaforoLogin } = useCheckMetaforoLogin();
  const { chain } = useNetwork();
  const { getMultiSNS } = useQuerySNS();

  const [searchParams, setSearchParams] = useSearchParams();

  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const keyword_addr = searchParams.get('q');
  const sort_field_addr = searchParams.get('sort_field');
  const sip_addr = searchParams.get('sip');
  const sort_order_addr = searchParams.get('sort_order');
  const page_addr = searchParams.get('page');
  const category_id = searchParams.get('category_id');
  const status_addr = searchParams.get('status');

  useEffect(() => {
    if(metaforoToken || !account || !userData || !chain)return;
    getMetaforo()
  }, [metaforoToken,account,userData,chain]);
  const getMetaforo = async()=>{
    await checkMetaforoLogin();
  }

  useEffect(() => {
    if (!searchParams.size) return;

    setPage(Number(page_addr) ?? 1);
    setIsFilterSIP(!!sip_addr);
    const selectArr = TIME_OPTIONS.filter((item) => item.value === sort_order_addr);
    let selectObj = selectArr[0] && JSON.parse(JSON.stringify(selectArr[0]));
    setSelectTime(selectObj ?? TIME_OPTIONS[0]);

    const selectCat = CATEGORY_OPTIONS.filter((item) => item.value === Number(category_id));
    let selectCatObj = selectCat[0] && JSON.parse(JSON.stringify(selectCat[0]));
    setSelectCategory(selectCatObj);

    const selectStatus = STATUS_OPTIONS.filter((item) => item.value === status_addr);
    let selectStatusObj = selectStatus[0] && JSON.parse(JSON.stringify(selectStatus[0]));
    setSelectStatus(selectStatusObj);

    setSearchKeyword(keyword_addr ?? '');
  }, [keyword_addr, sort_field_addr, sip_addr, sort_order_addr, page_addr, category_id]);

  const handleSNS = async (wallets: string[]) => {
    try{
      const sns_map = await getMultiSNS(wallets);
      setSnsMap(sns_map);
    }catch(error:any){
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }

  };

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };

  const getProposalList = async (_page: number = 1) => {
    RESULT_ID++;
    let rid = RESULT_ID;
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await requests.proposalV2.getProposalList({
        page: _page,
        size: PAGE_SIZE,
        sort_order: selectTime.value,
        sort_field: isFilterSIP ? 'sip' : 'create_ts',
        state: selectStatus?.value,
        category_id: selectCategory?.value,
        q: searchKeyword,
        sip: isFilterSIP ? 1 : '',
      });
      if (rid !== RESULT_ID) return;
      setProposalList(resp.data.rows);
      handleSNS(resp.data.rows.filter((d) => !!d.applicant).map((d) => d.applicant));
      setTotalCount(resp.data.total);
    } catch (error:any) {
      logError('getAllProposals failed', error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const tokenstr = localStorage.getItem(SEEDAO_USER);

  useEffect(() => {
    // if(metaforoToken === undefined) return;

    getProposalList(page);
  }, [selectCategory, selectTime, selectStatus, searchKeyword, isFilterSIP, page,metaforoToken,tokenstr]);

  const onKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      // setSearchKeyword(e.target.value);
      searchParams.set('q', e.target.value);
      setSearchParams(searchParams);
    }
  };
  const clearSearch = () => {
    setInputKeyword('');
    // setSearchKeyword('');
    searchParams.set('q', '');
    setSearchParams(searchParams);
  };

  const go2page = (_page: number) => {
    // setPage(_page + 1);
    // getProposalList(_page + 1);

    searchParams.set('page', (_page + 1).toString());
    setSearchParams(searchParams);
  };

  const handleClickHistory = async () => {
    const canOpen = await checkMetaforoLogin();
    if (canOpen) {
      setCurrentTab(TabType.History);
    }
  };

  const handleClickMyProposals = async () => {
    const canOpen = await checkMetaforoLogin();
    if (canOpen) {
      setCurrentTab(TabType.My);
    }
  };

  const go2create = async () => {
    const canCreate = await checkMetaforoLogin();
    if (canCreate) {
      navigate('/proposal/create');
    }
  };

  const handleFilter = () => {
    const newV = !isFilterSIP;
    searchParams.set('sort_field', newV ? 'sip' : 'create_ts');
    searchParams.set('sip', newV ? '1' : '');
    setSearchParams(searchParams);
  };

  const showContent = () => {
    switch (currentTab) {
      case TabType.All:
        return (
          <>
            <FlexLine>
              <FilterBox>
                <SeeSelect
                  width="160px"
                  options={TIME_OPTIONS}
                  value={selectTime}
                  isClearable={false}
                  isSearchable={false}
                  onChange={(v: ISelectItem) => {
                    setSelectTime(v);
                    searchParams.set('sort_order', v?.value ?? '');
                    setSearchParams(searchParams);
                  }}
                />
                <SeeSelect
                  width="160px"
                  options={CATEGORY_OPTIONS}
                  isSearchable={false}
                  value={selectCategory}
                  placeholder={t('Proposal.TypeSelectHint')}
                  onChange={(v: ISelectItem) => {
                    setSelectCategory(v);
                    searchParams.set('category_id', v?.value ?? '');
                    setSearchParams(searchParams);
                  }}
                />
                <SeeSelect
                  width="160px"
                  options={STATUS_OPTIONS}
                  value={selectStatus}
                  isSearchable={false}
                  placeholder={t('Proposal.StatusSelectHint')}
                  onChange={(v: ISelectItem) => {
                    setSelectStatus(v);
                    searchParams.set('status', v?.value ?? '');
                    setSearchParams(searchParams);
                  }}
                />
                {/*<SipButton $selected={isFilterSIP ? 1 : 0} onClick={() => setIsFilterSIP((prev) => !prev)}>*/}
                <SipButton $selected={isFilterSIP ? 1 : 0} onClick={() => handleFilter()}>
                  SIP
                </SipButton>

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
            </FlexLine>
            {proposalList.map((p) => (
              <SimpleProposalItem
                key={p.id}
                data={p}
                metaforoToken={metaforoToken}
                sns={formatSNS(p.applicant?.toLocaleLowerCase())}
                currentTab={[currentTab]}
              />
            ))}
            {totalCount === 0 && !loading && <NoItem />}
            {totalCount > PAGE_SIZE && (
              <div>
                <Pagination itemsPerPage={PAGE_SIZE} total={totalCount} current={page - 1} handleToPage={go2page} />
              </div>
            )}
          </>
        );
      case TabType.History:
        return <HistoryAction />;
      case TabType.My:
        return <MyProposalsTab tab={secondTab} />;
      default:
        return null;
    }
  };

  return (
    <Page>
      <OperateBox>
        <LineBox>
          <HistoryButton
            className={currentTab === TabType.All ? 'selected' : ''}
            onClick={() => setCurrentTab(TabType.All)}
          >
            {t('Proposal.all')}
          </HistoryButton>
          <HistoryButton className={currentTab === TabType.History ? 'selected' : ''} onClick={handleClickHistory}>
            {t('Proposal.HistoryRecord')}
          </HistoryButton>
          <HistoryButton className={currentTab === TabType.My ? 'selected' : ''} onClick={handleClickMyProposals}>
            {t('Proposal.MyProposals')}
          </HistoryButton>
        </LineBox>
        <div>
          <Button variant="primary" onClick={go2create}>
            <img src={AddImg} alt="" className="mr20" />
            {t('Proposal.CreateProposal')}
          </Button>
        </div>
      </OperateBox>
      {showContent()}
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
  margin-bottom: 20px;
`;

const FilterBox = styled.div`
  display: flex;
  gap: 24px;
`;

const SearchBox = styled.div`
  width: 240px;
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
  min-width: 104px;
  box-sizing: border-box;
  padding-inline: 10px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background-color: var(--bs-background);
  border-radius: 100px;
  font-size: 14px;
  text-align: center;
  color: var(--bs-body-color_active);
  cursor: pointer;
  border: 1px solid var(--bs-background);

  &.selected {
    background-color: var(--bs-primary);
    color: #fff;
  }
  &:hover {
    border: 1px solid var(--bs-border-color);
  }
`;

const LineBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
`;

const FlexLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 20px;
`;

const SipButton = styled.div<{ $selected: number }>`
  width: 100px;
  text-align: center;
  line-height: 38px;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid var(--bs-border-color);
  border-color: ${(props) => (props.$selected ? 'var(--bs-primary)' : 'var(--bs-border-color)')};
  background-color: var(--bs-background);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    border-color: ${(props) => (props.$selected ? 'var(--bs-primary)' : 'rgb(179, 179, 179)')};
  }
  color: ${(props) => (props.$selected ? 'var(--bs-primary)' : 'var(--bs-body-color)')};
`;
