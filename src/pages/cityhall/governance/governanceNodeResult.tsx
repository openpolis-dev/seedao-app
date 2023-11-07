import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import { getGovernanceNodeResult } from 'requests/cityHall';
import { useEffect, useMemo, useState } from 'react';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import publicJs from 'utils/publicJs';
import useQuerySNS from 'hooks/useQuerySNS';
import { formatNumber } from 'utils/number';
import ExcellentExport from 'excellentexport';

const PAGE_SIZE = 15;

type SeasonCreadit = {
  season_idx: number;
  season_name: string;
  total: string;
};

interface IRowData {
  wallet: string;
  seasons_credit: SeasonCreadit[];
  season_total_credit: string;
  activity_credit: string;
  metaforo_credit: string;
  seed_count: number;
  effective_credit: string;
}

const ColGroup = () => {
  return (
    <colgroup>
      <col style={{ width: '150px' }} />
      <col style={{ width: '100px' }} />
      <col style={{ width: '100px' }} />
      <col style={{ width: '100px' }} />
      <col style={{ width: '100px' }} />
      <col style={{ width: '100px' }} />
      <col style={{ width: '120px' }} />
      <col style={{ width: '120px' }} />
      <col style={{ width: '120px' }} />
      <col style={{ width: '150px' }} />
    </colgroup>
  );
};

export default function GoveranceNodeResult() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const [page, setPage] = useState(1);
  const [total, setToal] = useState(0);
  const [allList, setAllList] = useState<IRowData[]>([]);
  const [displayList, setDisplayList] = useState<IRowData[]>([]);
  const [dataMap, setDataMap] = useState<Map<string, string>>(new Map<string, string>());
  const [searchKey, setSearchKey] = useState('');

  const { getMultiSNS } = useQuerySNS();

  useEffect(() => {
    const getList = () => {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });

      getGovernanceNodeResult()
        .then((res) => {
          console.log(res);
          setToal(res.data.length);
          setAllList(res.data);
          setDisplayList(res.data);

          const _wallets = new Set<string>();
          res.data.forEach((item: IRowData) => {
            _wallets.add(item.wallet);
          });
          getMultiSNS(Array.from(_wallets)).then((_dataMap) => {
            setDataMap(_dataMap);
          });
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          dispatch({ type: AppActionType.SET_LOADING, payload: false });
        });
    };
    getList();
  }, []);

  const formatSNS = (wallet: string) => {
    const sns = dataMap.get(wallet) || wallet;
    return sns.startsWith('0x') && !sns.endsWith('.seedao') ? publicJs.AddressToShow(sns, 6) : sns;
  };

  const handleExport = () => {
    ExcellentExport.convert({ filename: t('GovernanceNodeResult.FileName'), format: 'xlsx', openAsDownload: true }, [
      {
        name: t('GovernanceNodeResult.SheetName'),
        from: {
          array: [
            [
              'SNS',
              'S0(SCR)',
              'S1(SCR)',
              'S2(SCR)',
              'S3(SCR)',
              t('GovernanceNodeResult.MinerReward', { season: 'S3' }) + '(SCR)',
              t('GovernanceNodeResult.Total') + '(SCR)',
              t('GovernanceNodeResult.ActiveSCR'),
              t('GovernanceNodeResult.EffectiveSCR'),
              t('GovernanceNodeResult.SeedCount'),
            ],
            ...allList.map((item) => [
              dataMap.get(item.wallet) || item.wallet,
              item.seasons_credit?.find((s) => s.season_idx === 0)?.total || 0,
              item.seasons_credit?.find((s) => s.season_idx === 1)?.total || 0,
              item.seasons_credit?.find((s) => s.season_idx === 2)?.total || 0,
              item.seasons_credit?.find((s) => s.season_idx === 3)?.total || 0,
              item.metaforo_credit || 0,
              item.season_total_credit || 0,
              item.activity_credit || 0,
              item.effective_credit || 0,
              item.seed_count || 0,
            ]),
          ],
        },
      },
    ]);
  };

  useEffect(() => {
    if (!allList.length) {
      return;
    }
    const trim_search_key = searchKey.trim().toLocaleLowerCase();
    if (!searchKey) {
      setDisplayList([...allList]);
    } else {
      const filter_list = allList.filter(
        (item) => item.wallet.includes(trim_search_key) || dataMap.get(item.wallet)?.includes(trim_search_key),
      );
      setDisplayList([...filter_list]);
    }
  }, [searchKey, allList, dataMap]);

  return (
    <OuterBox>
      <BackerNav title={t('city-hall.GovernanceNodeResult')} to="/city-hall/governance" />
      <OperateBox>
        <SearchBox>
          <Form.Control
            type="text"
            placeholder={t('GovernanceNodeResult.SearchTip')}
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </SearchBox>

        <Button variant="primary" onClick={handleExport}>
          {t('GovernanceNodeResult.Export')}
        </Button>
      </OperateBox>
      <TableBox>
        <Table id="head-table">
          <ColGroup />
          <thead>
            <th>SNS</th>
            <th>S0(SCR)</th>
            <th>S1(SCR)</th>
            <th>S2(SCR)</th>
            <th>
              <CurrentSeason>S3</CurrentSeason>(SCR)
            </th>
            <th>
              <HeaderCell>{t('GovernanceNodeResult.MinerReward', { season: 'S3' })}(SCR)</HeaderCell>
            </th>
            <th>{t('GovernanceNodeResult.Total')}(SCR)</th>
            <th>{t('GovernanceNodeResult.ActiveSCR')}</th>
            <th>{t('GovernanceNodeResult.EffectiveSCR')}</th>
            <th>{t('GovernanceNodeResult.SeedCount')}</th>
          </thead>
        </Table>
        <Table id="body-table">
          <ColGroup />
          <tbody>
            {displayList.map((item, index) => (
              <tr key={item.wallet}>
                <td>{formatSNS(item.wallet)}</td>
                <td>{formatNumber(Number(item.seasons_credit?.find((s) => s.season_idx === 0)?.total || 0))}</td>
                <td>{formatNumber(Number(item.seasons_credit?.find((s) => s.season_idx === 1)?.total || 0))}</td>
                <td>{formatNumber(Number(item.seasons_credit?.find((s) => s.season_idx === 2)?.total || 0))}</td>
                <td>{formatNumber(Number(item.seasons_credit?.find((s) => s.season_idx === 3)?.total || 0))}</td>
                <td>{formatNumber(Number(item.metaforo_credit) || 0)}</td>
                <td>{formatNumber(Number(item.season_total_credit) || 0)}</td>
                <td>{formatNumber(Number(item.activity_credit) || 0)}</td>
                <td>{formatNumber(Number(item.effective_credit) || 0)}</td>
                <td>{item.seed_count}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
`;

const OperateBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const SearchBox = styled.div`
  width: 200px;
  position: relative;
`;

const TableBox = styled.div`
  height: calc(100vh - 262px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
  .table {
    table-layout: fixed;
    margin-bottom: 0;
    &#head-table {
      position: sticky;
      top: 0;
    }
    thead tr:first-child {
      th {
        border-top: none;
      }
      th:first-child {
        border-top-left-radius: 16px;
        border-left: none;
      }
      th:last-child {
        border-top-right-radius: 16px;
        border-right: none;
      }
    }
    thead tr:last-child th {
      border-radius: 0;
    }

    th {
      border-style: inherit;
      box-sizing: border-box;
      text-align: center;
    }
    td {
      padding: 0;
      text-align: center;
      box-sizing: border-box;
      line-height: 74px;
    }
    tr td:first-child {
      padding: 0 !important;
    }
    tr td:last-child {
      padding: 0 !important;
    }
    th.sticky,
    td.sticky {
      /* position: sticky;
      left: 0; */
    }
  }
`;

const HeaderCell = styled.div`
  white-space: wrap;
  font-family: Poppins-SemiBold, Poppins;
  background-color: transparent !important;
  color: var(--bs-body-color_active) !important;
`;

const CurrentSeason = styled(HeaderCell)`
  color: var(--bs-primary) !important;
  display: inline;
  padding: 0 !important;
`;
