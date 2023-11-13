import styled from 'styled-components';
import { useState, useMemo, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';

import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { formatNumber } from 'utils/number';
import publicJs from 'utils/publicJs';
import ExcellentExport from 'excellentexport';
import { getGovernanceNodeResult } from 'requests/cityHall';
import useQuerySNS from 'hooks/useQuerySNS';
import { useAuthContext, AppActionType } from 'providers/authProvider';

const ColGroup = () => {
  return (
    <colgroup>
      <col style={{ width: '80px' }} />
      <col style={{ width: '340px' }} />
      <col style={{ width: '150px' }} />
      <col style={{ width: '150px' }} />
      <col style={{ width: '150px' }} />
      <col style={{ width: '150px' }} />
      <col style={{ width: '150px' }} />
    </colgroup>
  );
};

type SeasonCreadit = {
  season_idx: number;
  season_name: string;
  total: string;
};

interface IRowData {
  wallet: string;
  seasons_credit: SeasonCreadit[];
  season_total_credit: string;
}

export default function SCRRank() {
  const { t } = useTranslation();
  const { state } = useLocation();

  const { dispatch } = useAuthContext();

  const [allList, setAllList] = useState<IRowData[]>([]);
  const [currentSeasonNumber, setCurrentSeasonNumber] = useState(0);
  const [dataMap, setDataMap] = useState<Map<string, string>>(new Map<string, string>());

  const { getMultiSNS } = useQuerySNS();

  const currentSeason = useMemo(() => {
    return `S${currentSeasonNumber}`;
  }, [currentSeasonNumber]);

  const allSeasons = useMemo(() => {
    if (currentSeasonNumber) {
      return Array.from({ length: currentSeasonNumber + 1 }, (_, i) => i);
    } else {
      return [];
    }
  }, [currentSeasonNumber]);
  console.log('allSeasons', allSeasons);

  const displayList = useMemo(() => {
    return [...allList];
  }, [allList]);

  const formatSNS = (wallet: string) => {
    return dataMap.get(wallet) || wallet;
  };

  const handleExport = () => {
    ExcellentExport.convert({ filename: t('GovernanceNodeResult.FileName'), format: 'xlsx', openAsDownload: true }, [
      {
        name: t('GovernanceNodeResult.SheetName'),
        from: {
          array: [
            ['SNS', ...allSeasons.map((s) => `S${s}(SCR)`), t('GovernanceNodeResult.Total') + '(SCR)'],
            ...allList.map((item) => [
              dataMap.get(item.wallet) || item.wallet,
              item.seasons_credit?.find((s) => s.season_idx === 0)?.total || 0,
              item.seasons_credit?.find((s) => s.season_idx === 1)?.total || 0,
              item.seasons_credit?.find((s) => s.season_idx === 2)?.total || 0,
              item.seasons_credit?.find((s) => s.season_idx === 3)?.total || 0,
              item.season_total_credit || 0,
            ]),
          ],
        },
        formats: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((c) => ({
          range: `${c}2:${c}1000`,
          format: ExcellentExport.formats.NUMBER,
        })),
      },
    ]);
  };

  useEffect(() => {
    const getList = () => {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });

      getGovernanceNodeResult()
        .then((res) => {
          const data = res.data;
          setAllList(data.records);

          setCurrentSeasonNumber(Number(data.season_name.replace('S', '')));

          const _wallets = new Set<string>();
          data.records.forEach((item: IRowData) => {
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

  return (
    <OuterBox>
      <BackerNav title={t('GovernanceNodeResult.SCRRank')} to={state || '/home'} />
      <OperateBox>
        <Button variant="primary" onClick={handleExport}>
          {t('GovernanceNodeResult.Export')}
        </Button>
      </OperateBox>
      <TableBox>
        <Table id="head-table">
          <ColGroup />
          <thead>
            <th>No.</th>
            <th>SNS</th>
            {allSeasons.map((s, i) => {
              return i === allSeasons.length - 1 ? (
                <th>
                  <CurrentSeason>{currentSeason}</CurrentSeason>(SCR)
                </th>
              ) : (
                <th key={s}>{`S${s}(SCR)`}</th>
              );
            })}
            <th>{t('GovernanceNodeResult.Total')}(SCR)</th>
          </thead>
        </Table>
        <Table id="body-table">
          <ColGroup />
          <tbody>
            {displayList.map((item, index) => (
              <tr key={item.wallet}>
                <td>{index + 1}</td>
                <td>{formatSNS(item.wallet)}</td>
                {[...allSeasons].map((season) => (
                  <td key={season}>
                    {formatNumber(Number(item.seasons_credit?.find((s) => s.season_idx === season)?.total || 0))}
                  </td>
                ))}

                <td>{formatNumber(Number(item.season_total_credit) || 0)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const OperateBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
`;

const TableBox = styled.div`
  height: calc(100vh - 240px);
  overflow-y: auto;
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
