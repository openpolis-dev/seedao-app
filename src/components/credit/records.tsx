import styled from 'styled-components';
import Pagination from 'components/pagination';
import NoItem from 'components/noItem';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import StateTag from './stateTag';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import sns from '@seedao/sns-js';
import { ethers } from 'ethers';
import Select from './select';
import { CreditRecordStatus, ICreditRecord } from 'type/credit.type';
import RecordDetailModal from './recordDetailModal';
import useCheckLogin from 'hooks/useCheckLogin';

const AllBorrowTable = () => {
  const { t } = useTranslation();
  const [detailData, setDetailData] = useState<any>(undefined);
  const [list, setList] = useState<ICreditRecord[]>([
    { status: CreditRecordStatus.CLEAR },
    { status: CreditRecordStatus.INUSE },
    { status: CreditRecordStatus.OVERDUE },
  ]);
  const [total, setTotal] = useState(100);
  const [page, setPage] = useState(1);
  const handlePageChange = () => {};

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
                    <BlueText onClick={() => setDetailData({ status: item.status })}>880000{idx + 1}</BlueText>
                  </td>
                  <td>amanda.seedao</td>
                  <td>
                    5,000.00 <span className="unit">USDT</span>
                  </td>
                  <td>
                    <StateTag state={item.status} />
                  </td>
                  <td>2024-05-09 20:00 UTC+8</td>
                  <td>2024-05-09 20:00 UTC+8</td>
                  <td>
                    <BlueText>0xe84o...56bd</BlueText>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoItem />
        )}
      </TableBox>
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
    </>
  );
};

const MyTable = () => {
  const { t } = useTranslation();

  const [list, setList] = useState([1, 2, 3]);
  const [total, setTotal] = useState(20);
  const [page, setPage] = useState(1);
  const handlePageChange = () => {};

  return (
    <>
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
                    <BlueText>8800001</BlueText>
                  </td>
                  <td>
                    5,000.00 <span className="unit">USDT</span>
                  </td>
                  <td>
                    <StateTag state={CreditRecordStatus.CLEAR} />
                  </td>
                  <td>
                    <BlueText>0xe84o...56bd</BlueText>
                  </td>
                  <td>2024-05-09 20:00 UTC+8</td>
                  <td>0.10%</td>
                  <td>30日</td>
                  <td>
                    5,000.00 <span className="unit">USDT</span>
                  </td>
                  <td>2024-05-09 20:00 UTC+8</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoItem />
        )}
      </TableBox>
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
    </>
  );
};

export default function CreditRecords() {
  const { t } = useTranslation();

  // search target user
  const [targetKeyword, setTargetKeyword] = useState('');
  const [searchTargetVal, setSearchTargetVal] = useState('');

  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState<'all' | 'mine'>('all');

  const filterOptions = useMemo(() => {
    return [
      { label: t('Credit.FilterTimeLatest'), value: `time;desc` },
      { label: t('Credit.FilterTimeEarliest'), value: `time;asc` },
      { label: t('Credit.FilterStatusInUse'), value: `state;${CreditRecordStatus.INUSE}` },
      { label: t('Credit.FilterStatusClear'), value: `state;${CreditRecordStatus.CLEAR}` },
      { label: t('Credit.FilterStatusOverdue'), value: `state;${CreditRecordStatus.OVERDUE}` },
      { label: t('Credit.FilterAmountFromLarge'), value: `amount;1` },
      { label: t('Credit.FilterAmountFromSmall'), value: `amount;0` },
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

  const openMine = () => {
    if (!loginStatus) {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
    setCurrentTab('mine');
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
  return (
    <CreditRecordsStyle>
      <NavBox>{t('Credit.Records')}</NavBox>
      <TabbarBox>
        <TitBox>
          <div onClick={() => setCurrentTab('all')}>
            <div className={currentTab === 'all' ? 'active' : ''}>{t('Credit.AllBorrow')}</div>
            {currentTab === 'all' && <div className="line" />}
          </div>
          <div onClick={openMine}>
            <div className={currentTab === 'mine' ? 'active' : ''}>{t('Credit.MyBorrow')}</div>
            {currentTab === 'mine' && <div className="line" />}
          </div>
        </TitBox>
        <FilterBox>
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
          <Select
            menuPortalTarget={document.body}
            NotClear={true}
            options={filterOptions}
            onChange={(value: any) => {
              setSeletValue(value?.value);
            }}
          />
        </FilterBox>
      </TabbarBox>
      {currentTab === 'all' ? <AllBorrowTable /> : <MyTable />}
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
