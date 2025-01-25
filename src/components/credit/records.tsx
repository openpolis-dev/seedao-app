import styled from 'styled-components';
import Pagination from 'components/pagination';
import NoItem from 'components/noItem';
import { useTranslation } from 'react-i18next';
import { useState, useMemo, useEffect } from 'react';
import StateTag from './stateTag';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import sns from '@seedao/sns-js';

import { ethers } from 'ethers';
import Select from './select';
import { CreditRecordStatus, ICreditRecord } from 'type/credit.type';
import RecordDetailModal from './recordDetailModal';
import useCheckLogin from 'hooks/useCheckLogin';
import { IFilterParams, getBorrowList } from 'requests/credit';
import publicJs from 'utils/publicJs';
import useQuerySNS from 'hooks/useQuerySNS';
import { useCreditContext } from 'pages/credit/provider';
import getConfig from 'utils/envCofnig';
const lendToken = getConfig().NETWORK.lend.lendToken;
const lendChain = getConfig().NETWORK.lend.chain;

type InterestData = {
  interestDays: number;
  interestAmount: number;
};

interface ITableProps {
  formatSNS?: (wallet: string) => string;
  list: ICreditRecord[];
  openDetail?: (data: ICreditRecord) => void;
}

interface IMyTableProps extends ITableProps {
  openMyDetail: (data: ICreditRecord, interest: InterestData) => void;
}

const AllBorrowTable = ({ list, openMyDetail, formatSNS }: IMyTableProps) => {
  const { t } = useTranslation();

  return (
    <>
      <TableBox>
        {list.length ? (
          <ListBox>
            <div className="head crow">
              <div className="th" style={{ width: '80px' }}>
                {t('Credit.BorrowID')}
              </div>
              <div className="th" style={{ width: '130px' }}>
                {t('Credit.BorrowName')}
              </div>
              <div className="th" style={{ width: '130px' }}>
                {t('Credit.BorrowAmount')}
              </div>
              <div className="th" style={{ width: '80px' }}>
                {t('Credit.BorrowStatus')}
              </div>
              <div className="th" style={{ width: '200px' }}>
                {t('Credit.BorrowTime')}
              </div>
              <div className="th" style={{ width: '200px' }}>
                {t('Credit.LastRepaymentTime')}
              </div>
              <div className="th" style={{ width: '130px' }}>
                {t('Credit.BorrowHash')}
              </div>
            </div>
            <div className="rows">
              {list.map((item, idx) => (
                <div className="crow brow" key={idx}>
                  <div style={{ width: '80px' }}>
                    <BlueText
                      onClick={() =>
                        openMyDetail(item, { interestAmount: item.interestAmount, interestDays: item.interestDays })
                      }
                    >
                      {item.lendIdDisplay}
                    </BlueText>
                  </div>
                  <div style={{ width: '130px' }}>{formatSNS && formatSNS(item.debtor)}</div>
                  <div style={{ width: '130px' }}>
                    {item.borrowAmount.format(4)} <span className="unit">{lendToken.symbol}</span>
                  </div>
                  <div style={{ width: '80px' }}>
                    <StateTag state={item.status} />
                  </div>
                  <div style={{ width: '200px' }}>{item.borrowTime}</div>
                  <div style={{ width: '200px' }}>{item.overdueTime}</div>
                  <div style={{ width: '130px' }}>
                    <BlueText
                      onClick={() =>
                        window.open(`${lendChain?.blockExplorers?.default.url}/tx/${item.borrowTx}`, '_blank')
                      }
                    >
                      {publicJs.AddressToShow(item.borrowTx)}
                    </BlueText>
                  </div>
                </div>
              ))}
            </div>
          </ListBox>
        ) : (
          <NoItem />
        )}
      </TableBox>
    </>
  );
};

const MyTable = ({ list, openMyDetail }: IMyTableProps) => {
  const { t } = useTranslation();

  const {
    state: { bondNFTContract },
  } = useCreditContext();
  const [intrest, setIntrest] = useState<Map<number, InterestData>>(new Map());

  useEffect(() => {
    const ids = list
      .filter((item) => item.status === CreditRecordStatus.INUSE && !intrest.get(Number(item.lendId)))
      .map((item) => Number(item.lendId));
    if (!ids.length) {
      return;
    }
    bondNFTContract
      ?.calculateLendsInterest(ids)
      .then((r: { interestAmounts: ethers.BigNumber[]; interestDays: ethers.BigNumber[] }) => {
        const _intrest = new Map<number, InterestData>(intrest);
        ids.forEach((id, idx) => {
          _intrest.set(id, {
            interestDays: r.interestDays[idx].toNumber(),
            interestAmount: Number(ethers.utils.formatUnits(r.interestAmounts[idx], lendToken.decimals)),
          });
        });
        setIntrest(_intrest);
      });
  }, [list, bondNFTContract]);

  return (
    <TableBox>
      {list.length ? (
        <ListBox>
          <div className="head crow">
            <div className="th" style={{ width: '100px' }}>
              {t('Credit.BorrowID')}
            </div>
            <div className="th" style={{ width: '130px' }}>
              {t('Credit.BorrowAmount')}
            </div>
            <div className="th" style={{ width: '80px' }}>
              {t('Credit.BorrowStatus')}
            </div>
            <div className="th" style={{ width: '130px' }}>
              {t('Credit.BorrowHash')}
            </div>
            <div className="th" style={{ width: '200px' }}>
              {t('Credit.BorrowTime')}
            </div>

            <div className="th short" style={{ width: '70px' }}>
              {t('Credit.DayRate')}
            </div>
            <div className="th short" style={{ width: '100px' }}>
              {t('Credit.BorrowDuration')}
            </div>
            <div className="th" style={{ width: '120px' }}>
              {t('Credit.TotalInterest')}
            </div>

            <div className="th" style={{ width: '200px' }}>
              {t('Credit.LastRepaymentTime')}
            </div>
          </div>
          <div>
            {list.map((item, idx) => (
              <div key={idx} className="crow brow">
                <div style={{ width: '100px' }}>
                  <BlueText
                    onClick={() =>
                      openMyDetail(
                        item,
                        intrest.get(Number(item.lendId)) || {
                          interestDays: item.interestDays,
                          interestAmount: item.interestAmount,
                        },
                      )
                    }
                  >
                    {item.lendIdDisplay}
                  </BlueText>
                </div>
                <div style={{ width: '130px' }}>
                  {item.borrowAmount.format(4)} <span className="unit">{lendToken.symbol}</span>
                </div>
                <div style={{ width: '80px' }}>
                  <StateTag state={item.status} />
                </div>
                <div style={{ width: '130px' }}>
                  <BlueText
                    onClick={() =>
                      window.open(`${lendChain?.blockExplorers?.default.url}/tx/${item.borrowTx}`, '_blank')
                    }
                  >
                    {publicJs.AddressToShow(item.borrowTx)}
                  </BlueText>
                </div>
                <div style={{ width: '200px' }}>{item.borrowTime}</div>
                <div style={{ width: '70px' }}>{item.rate}%</div>
                <div style={{ width: '100px' }}>
                  {item.status === CreditRecordStatus.OVERDUE ? (
                    <NoData>-</NoData>
                  ) : (
                    `${intrest.get(Number(item.lendId))?.interestDays || item.interestDays}日`
                  )}
                </div>
                <div style={{ width: '120px' }}>
                  {item.status === CreditRecordStatus.OVERDUE ? (
                    <NoData>-</NoData>
                  ) : (
                    <>
                      {(intrest.get(Number(item.lendId))?.interestAmount || item.interestAmount).format(4)}{' '}
                      <span className="unit">{lendToken.symbol}</span>
                    </>
                  )}
                </div>
                <div style={{ width: '200px' }}>{item.overdueTime}</div>
              </div>
            ))}
          </div>
        </ListBox>
      ) : (
        <NoItem />
      )}
    </TableBox>
  );
};

export default function CreditRecords() {
  const { t } = useTranslation();

  const [list, setList] = useState<ICreditRecord[]>([]);
  const [total, setTotal] = useState(100);
  const [page, setPage] = useState(1);

  // search target user
  const [targetKeyword, setTargetKeyword] = useState('');
  const [searchTargetVal, setSearchTargetVal] = useState('');

  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState<'all' | 'mine'>('all');
  const [detailData, setDetailData] = useState<ICreditRecord>();

  const filterOptions = useMemo(() => {
    return [
      { label: t('Credit.FilterTimeLatest'), value: `borrowTimestamp;desc` },
      { label: t('Credit.FilterTimeEarliest'), value: `borrowTimestamp;asc` },
      { label: t('Credit.FilterStatusInUse'), value: `lendStatus;${CreditRecordStatus.INUSE}` },
      { label: t('Credit.FilterStatusClear'), value: `lendStatus;${CreditRecordStatus.CLEAR}` },
      { label: t('Credit.FilterStatusOverdue'), value: `lendStatus;${CreditRecordStatus.OVERDUE}` },
      { label: t('Credit.FilterAmountFromLarge'), value: `borrowAmount;desc` },
      { label: t('Credit.FilterAmountFromSmall'), value: `borrowAmount;asc` },
    ];
  }, [t]);
  // filter
  const [selectOption, setSelectOption] = useState(filterOptions[0]);
  const [selectValue, setSeletValue] = useState(filterOptions[0].value);

  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const {
    state: { account },
    dispatch,
  } = useAuthContext();

  const {
    state: { bondNFTContract },
  } = useCreditContext();

  const { getMultiSNS } = useQuerySNS();

  const isLogin = useCheckLogin(account);
  const loginStatus = isLogin && !!account;


  const handleSNS = async (wallets: string[]) => {
    try{
      const sns_map = await getMultiSNS(wallets);
      setSnsMap(sns_map);
    }catch(error:any){
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }

  };

  const formatSNS = (wallet: string, shorten = true) => {
    const name = snsMap.get(wallet?.toLocaleLowerCase()) || wallet;
    return name?.endsWith('.seedao') ? name : shorten ? publicJs.AddressToShow(name, 4) : wallet;
  };

  const getList = (page: number, tab: 'all' | 'mine') => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const params: IFilterParams = {
      page,
      size: 10,
    };
    if (selectValue) {
      const [field, v] = selectValue.split(';');
      if (field === 'lendStatus') {
        params.lendStatus = Number(v);
      } else {
        params.sortField = field as 'borrowAmount' | 'borrowTimestamp';
        params.sortOrder = v as 'asc' | 'desc';
      }
    }
    if (tab === 'mine') {
      params.debtor = account;
    } else if (searchTargetVal) {
      params.debtor = searchTargetVal;
    }
    getBorrowList(params)
      .then((r) => {
        setTotal(r.total);
        setList(r.data);

        const _wallets = r.data.map((item) => item.debtor);
        handleSNS(Array.from(_wallets));
      }).catch((error:any)=>{
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };

  useEffect(() => {
    getList(page, currentTab);
  }, [selectValue, searchTargetVal, currentTab]);

  const onChangeTab = (tab: 'all' | 'mine') => {
    setPage(1);
    setCurrentTab(tab);
    setTargetKeyword('');
    setSearchTargetVal('');
    setSeletValue(filterOptions[0].value);
    setSelectOption(filterOptions[0]);
  };
  const openMine = () => {
    if (!loginStatus) {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
    onChangeTab('mine');
  };

  const handleSearch = async (keyword: string, setSearchVal: (v: string) => void) => {
    if (keyword.endsWith('.seedao')) {
      // sns
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      const w = await sns.resolve(keyword,getConfig().NETWORK.rpcs[0]);
      if (w && w !== ethers.constants.AddressZero) {
        setSearchVal(w?.toLocaleLowerCase());
        setPage(1);
      } else {
        showToast(t('Msg.SnsNotFound', { sns: keyword }), ToastType.Danger);
      }
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    } else if (ethers.utils.isAddress(keyword)) {
      // address
      setSearchVal(keyword?.toLocaleLowerCase());
      setPage(1);
    } else if (keyword) {
      showToast(t('Msg.InvalidAddress', { address: keyword }), ToastType.Danger);
    } else {
      setSearchVal('');
      setPage(1);
    }
  };

  const onKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      handleSearch(targetKeyword, setSearchTargetVal);
    }
  };

  const clearSearch = () => {
    setSearchTargetVal('');
    setTargetKeyword('');
  };

  const showDetail = (data: ICreditRecord, interest: InterestData) => {
    if (!interest.interestDays || data.status === CreditRecordStatus.INUSE) {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      bondNFTContract
        ?.calculateLendInterest(Number(data.lendId))
        .then((r: { interestDays: ethers.BigNumber; interestAmount: ethers.BigNumber }) => {
          const newData: ICreditRecord = {
            ...data,
            interestDays: r.interestDays.toNumber(),
            interestAmount: Number(ethers.utils.formatUnits(r.interestAmount, lendToken.decimals)),
          };
          setDetailData(newData);
        })
        .catch((error: any) => {
          // showToast('获取利息失败, 请重试', ToastType.Danger);
          showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
        })
        .finally(() => {
          dispatch({ type: AppActionType.SET_LOADING, payload: false });
        });
    } else {
      setDetailData({
        ...data,
        interestAmount: interest?.interestAmount || 0,
        interestDays: interest.interestDays || 0,
      });
    }
  };

  const handlePageChange = (num: number) => {
    setPage(num + 1);
    getList(num + 1, currentTab);
  };

  useEffect(() => {
    const openMine = ({ detail }: any) => {
      if (currentTab === 'mine') {
        getList(1, 'mine');
        setPage(1);
      } else if (detail?.openMine) {
        onChangeTab('mine');
      } else {
        getList(1, currentTab);
        setPage(1);
      }
    };
    document.addEventListener('openMine', openMine);
    return () => {
      document.removeEventListener('openMine', openMine);
    };
  });
  return (
    <CreditRecordsStyle>
      <TabbarBox>
        <TitBox>
          <div onClick={() => onChangeTab('all')}>
            <div className={currentTab === 'all' ? 'active' : ''}>{t('Credit.AllBorrow')}</div>
            {currentTab === 'all' && <div className="line" />}
          </div>
          <div onClick={openMine}>
            <div className={currentTab === 'mine' ? 'active' : ''}>{t('Credit.MyBorrow')}</div>
            {currentTab === 'mine' && <div className="line" />}
          </div>
        </TitBox>
        <FilterBox>
          {currentTab === 'all' && (
            <SearchBox>
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <g stroke="rgba(113, 142, 191, 0.54)" stroke-width="2">
                  <circle cx="10.3446" cy="11.3209" r="6.10797" />
                  <path d="m15.1745 15.6406 3.6867 2.7891" strokeLinecap="round" />
                </g>
              </svg>
              <input
                type="text"
                placeholder={t('Credit.AddressHint')}
                onKeyUp={onKeyUp}
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
              />
              {targetKeyword && (
                <svg
                  onClick={clearSearch}
                  className="clear"
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  aria-hidden="true"
                >
                  <path
                    style={{ fill: 'rgba(113, 142, 191, 0.54)' }}
                    d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
                  />
                </svg>
              )}
            </SearchBox>
          )}

          <Select
            menuPortalTarget={document.body}
            NotClear={true}
            options={filterOptions}
            value={selectOption}
            onChange={(value: any) => {
              setSeletValue(value?.value);
              setSelectOption(value);
              if (selectValue !== value?.value) {
                setPage(1);
              }
            }}
          />
        </FilterBox>
      </TabbarBox>
      {currentTab === 'all' ? (
        <AllBorrowTable list={list} openMyDetail={showDetail} formatSNS={formatSNS} />
      ) : (
        <MyTable list={list} openMyDetail={showDetail} />
      )}
      {!!list.length && (
        <Pagination
          dir="right"
          itemsPerPage={10}
          total={total}
          current={page - 1}
          handleToPage={handlePageChange}
          showGotopage={false}
        />
      )}
      {detailData && (
        <RecordDetailModal
          borrowName={formatSNS(detailData.debtor, false)}
          data={detailData}
          handleClose={() => setDetailData(undefined)}
        />
      )}
    </CreditRecordsStyle>
  );
}

const CreditRecordsStyle = styled.div`
  margin-top: 40px;
  .page-link {
    width: 38px;
    height: 38px;
    line-height: 38px;
    margin-right: 0;
    background-color: transparent;
    color: #1814f3;
    font-family: 'Inter-Medium';
    font-weight: 500;
    &:hover {
      color: #1814f3;
      background: unset;
    }
  }
  .active {
    .page-link {
      background: #1814f3;
      color: #fff;
    }
  }
`;
const TabbarBox = styled.div`
  border-bottom: 1px solid #ebeef2;
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 20px;
  padding-bottom: 12px;
`;

const TitBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #718ebf;
  line-height: 10px;
  gap: 30px;
  > div {
    position: relative;
    cursor: pointer;
    line-height: 20px;
    padding-inline: 10px;
    .active {
      color: #1814f3;
      font-family: 'Inter-SemiBold';
    }
    .line {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: -13px;
      border-radius: 10px 10px 0 0;
      background-color: #1814f3;
      height: 3px;
    }
  }
  dd {
    position: relative;
  }
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 25px;
  background-color: #fff;
  padding: 24px 32px 32px;
  .short {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const BlueText = styled.div`
  color: #1814f3;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SearchBox = styled.div`
  width: 270px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border: 1px solid #718ebf;
  font-size: 14px;
  input {
    flex: 1;
    border: 0;
    background: transparent;
    margin-left: 6px;
    height: 24px;
    color: #718ebf;
    &::placeholder {
      color: rgba(113, 142, 191, 0.54);
      font-size: 12px;
    }
    &:focus {
      outline: none;
    }
  }
  svg.clear {
    cursor: pointer;
  }
`;

const FilterBox = styled.div`
  display: flex;
  gap: 30px;
`;

const NoData = styled.span`
  color: red;
`;

const ListBox = styled.div`
  color: #232323;
  font-size: 14px;
  .head {
    border-bottom: 1px solid #e6eff5;
    color: #718ebf;
    font-family: 'Inter-Medium';
    font-weight: 500;
  }
  .crow {
    line-height: 54px;
    display: flex;
    justify-content: space-between;
  }
  .brow {
    border-bottom: 1px solid #f2f4f7;
    &:last-child {
      border-bottom: none;
    }
  }
`;
