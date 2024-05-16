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
import { amoy } from 'utils/chain';

interface ITableProps {
  list: ICreditRecord[];
  openDetail: (data: ICreditRecord) => void;
}

const AllBorrowTable = ({ list, openDetail }: ITableProps) => {
  const { t } = useTranslation();

  return (
    <>
      <TableBox>
        {list.length ? (
          <table className="table" cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>{t('Credit.BorrowID')}</th>
                <th>{t('Credit.BorrowName')}</th>
                <th>{t('Credit.BorrowAmount')}</th>
                <th>{t('Credit.BorrowStatus')}</th>
                <th>{t('Credit.BorrowTime')}</th>
                <th>{t('Credit.LastRepaymentTime')}</th>
                <th>{t('Credit.BorrowHash')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <BlueText onClick={() => openDetail(item)}>{item.lendIdDisplay}</BlueText>
                  </td>
                  <td>{publicJs.AddressToShow(item.debtor)}</td>
                  <td>
                    {item.borrowAmount.format()} <span className="unit">USDT</span>
                  </td>
                  <td>
                    <StateTag state={item.status} />
                  </td>
                  <td>{item.borrowTime}</td>
                  <td>{item.overdueTime}</td>
                  <td>
                    <BlueText
                      onClick={() => window.open(`${amoy.blockExplorers.default.url}/tx/${item.borrowTx}`, '_blank')}
                    >
                      {publicJs.AddressToShow(item.borrowTx)}
                    </BlueText>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoItem />
        )}
      </TableBox>
    </>
  );
};

const MyTable = ({ list, openDetail }: ITableProps) => {
  const { t } = useTranslation();
  return (
    <TableBox>
      {list.length ? (
        <table className="table" cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              <th>{t('Credit.BorrowID')}</th>
              <th>{t('Credit.BorrowAmount')}</th>
              <th>{t('Credit.BorrowStatus')}</th>
              <th>{t('Credit.BorrowHash')}</th>
              <th>{t('Credit.BorrowTime')}</th>

              <th>{t('Credit.DayRate')}</th>
              <th>{t('Credit.BorrowDuration')}</th>
              <th>{t('Credit.TotalInterest')}</th>

              <th>{t('Credit.LastRepaymentTime')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <BlueText onClick={() => openDetail(item)}>{item.lendIdDisplay}</BlueText>
                </td>
                <td>
                  {item.borrowAmount.format()} <span className="unit">USDT</span>
                </td>
                <td>
                  <StateTag state={CreditRecordStatus.CLEAR} />
                </td>
                <td>
                  <BlueText
                    onClick={() => window.open(`${amoy.blockExplorers.default.url}/tx/${item.borrowTx}`, '_blank')}
                  >
                    {publicJs.AddressToShow(item.borrowTx)}
                  </BlueText>
                </td>
                <td>{item.borrowTime}</td>
                <td>{item.rate}‰</td>
                <td>{item.interestDays}日</td>
                <td>
                  {item.interestAmount.format()} <span className="unit">USDT</span>
                </td>
                <td>{item.overdueTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  const [selectValue, setSeletValue] = useState(filterOptions[0].value);

  const {
    state: { account },
    dispatch,
  } = useAuthContext();

  const isLogin = useCheckLogin(account);

  const loginStatus = isLogin && !!account;

  const getList = (page: number, tab: 'all' | 'mine') => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
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
        console.log('r', r);
        setTotal(r.total);
        setList(r.data);
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
      });
  };

  useEffect(() => {
    getList(page, currentTab);
  }, [selectValue, searchTargetVal]);

  const onChangeTab = (tab: 'all' | 'mine') => {
    setPage(1);
    setCurrentTab(tab);
    getList(1, tab);
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
      const w = await sns.resolve(keyword);
      if (w && w !== ethers.constants.AddressZero) {
        setSearchVal(w?.toLocaleLowerCase());
      } else {
        showToast(t('Msg.SnsNotFound', { sns: keyword }), ToastType.Danger);
      }
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    } else if (ethers.utils.isAddress(keyword)) {
      // address
      setSearchVal(keyword?.toLocaleLowerCase());
    } else if (keyword) {
      showToast(t('Msg.InvalidAddress', { address: keyword }), ToastType.Danger);
    } else {
      setSearchVal('');
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

  const handlePageChange = (num: number) => {
    setPage(num + 1);
    getList(num + 1, currentTab);
  };
  return (
    <CreditRecordsStyle>
      <NavBox>{t('Credit.Records')}</NavBox>
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
                  <path d="m15.1745 15.6406 3.6867 2.7891" stroke-linecap="round" />
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
            defaultValue={filterOptions[0]}
            onChange={(value: any) => {
              setSeletValue(value?.value);
            }}
          />
        </FilterBox>
      </TabbarBox>
      {currentTab === 'all' ? (
        <AllBorrowTable list={list} openDetail={setDetailData} />
      ) : (
        <MyTable list={list} openDetail={setDetailData} />
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
      {detailData && <RecordDetailModal data={detailData} handleClose={() => setDetailData(undefined)} />}
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

const NavBox = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #343c6a;
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

  .table {
    th {
      background: transparent;
      color: #718ebf;
      border-radius: 0;
      border-bottom: 1px solid #f2f4f7;
      padding: 0 0 6px !important;
      font-weight: 400;
    }
    th:first-child {
      padding-left: 0 !important;
    }
    td {
      background: transparent;
      border-top-color: #f2f4f7;
      height: 54px;
      padding: 0 !important;
    }
    tr td:first-child {
      padding-left: 0 !important;
    }
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
