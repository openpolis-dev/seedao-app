import styled from 'styled-components';
import Pagination from 'components/pagination';
import NoItem from 'components/noItem';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import StateTag from './stateTag';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import SearchWhite from 'assets/Imgs/light/search.svg';
import SearchImg from 'assets/Imgs/light/search.svg';
import useToast, { ToastType } from 'hooks/useToast';
import sns from '@seedao/sns-js';
import { ethers } from 'ethers';
import ClearSVGIcon from 'components/svgs/clear';
import Select from 'components/common/select';
import { CreditRecordStatus, ICreditRecord } from 'type/credit.type';
import RecordDetailModal from './recordDetailModal';

const AllBorrowTable = () => {
  const { t } = useTranslation();
  const [detailData, setDetailData] = useState<any>(undefined);
  const [list, setList] = useState<ICreditRecord[]>([
    { status: CreditRecordStatus.CLEAR },
    { status: CreditRecordStatus.INUSE },
    { status: CreditRecordStatus.OVERDUE },
  ]);
  const [total, setTotal] = useState(10);
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
        <Pagination dir="right" itemsPerPage={10} total={total} current={page - 1} handleToPage={handlePageChange} />
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
        <Pagination dir="right" itemsPerPage={10} total={total} current={page - 1} handleToPage={handlePageChange} />
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
    state: { theme },
    dispatch,
  } = useAuthContext();

  const openMine = () => {
    //   TODO check login
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
          <dl className={currentTab === 'all' ? 'active' : ''} onClick={() => setCurrentTab('all')}>
            <dd>{t('Credit.AllBorrow')}</dd>
          </dl>
          <dl className={currentTab === 'mine' ? 'active' : ''} onClick={openMine}>
            <dd>{t('Credit.MyBorrow')}</dd>
          </dl>
        </TitBox>
        <FilterBox>
          <SearchBox>
            <img src={theme ? SearchWhite : SearchImg} alt="" />
            <input
              type="text"
              placeholder={t('Credit.AddressHint')}
              onKeyUp={onKeyUp}
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
            />
            {targetKeyword && <ClearSVGIcon onClick={clearSearch} />}
          </SearchBox>
          <SelectStyle
            menuPortalTarget={document.body}
            width="150px"
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
  dl {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 40px;
    cursor: pointer;
    &.active {
      color: #1814f3;
      dd:after {
        content: '';
        width: 100%;
        height: 3px;
        border-radius: 10px, 0px, 0px;
        background: #1814f3;
        position: absolute;
        bottom: -18px;
        left: 0;
      }
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
      font-family: Poppins-Regular;
      font-size: 400;
    }
    td {
      background: transparent;
      border-top-color: #f2f4f7;
      height: 54px;
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
  background: var(--bs-box-background);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid #718ebf;
  font-size: 14px;
  input {
    width: calc(100% - 40px);
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
  svg {
    cursor: pointer;
  }
`;

const FilterBox = styled.div`
  display: flex;
  gap: 30px;
`;

const SelectStyle = styled(Select)`
  font-size: 14px;
  .react-select__control {
    height: 32px !important;
    min-height: unset;
  }
  .react-select__value-container {
    padding-block: 4px;
  }
`;
