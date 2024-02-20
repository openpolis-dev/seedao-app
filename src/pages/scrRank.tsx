import styled from 'styled-components';
import { useState, useMemo, useEffect } from 'react';
import { Table } from 'react-bootstrap';

import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { formatNumber, getShortDisplay } from 'utils/number';
import ExcellentExport from 'excellentexport';
import { getGovernanceNodeResult } from 'requests/cityHall';
import useQuerySNS from 'hooks/useQuerySNS';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import RankDownIcon from 'assets/Imgs/rank_down.svg';
import RankUpIcon from 'assets/Imgs/rank_up.svg';
import RankIcon from 'assets/Imgs/rank.svg';

import { PermissionObject, PermissionAction } from 'utils/constant';
import usePermission from 'hooks/usePermission';
import { PlainButton } from 'components/common/button';
import publicJs from 'utils/publicJs';

const ColGroup = ({ seasons }: { seasons: number[] }) => {
  return (
    <colgroup>
      <col style={{ width: '80px' }} />
      <col style={{ width: '170px' }} />
      {seasons.map((s) => (
        <col style={{ width: '150px' }} key={s} />
      ))}
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

enum RankDirection {
  default = 0,
  descend,
  ascend,
}

const getRankIcon = (direction: RankDirection) => {
  switch (direction) {
    case RankDirection.descend:
      return RankDownIcon;
    case RankDirection.ascend:
      return RankUpIcon;
    default:
      return RankIcon;
  }
};

export default function SCRRank() {
  const { t } = useTranslation();
  const { state } = useLocation();

  const { dispatch } = useAuthContext();

  const [allList, setAllList] = useState<IRowData[]>([]);
  const [currentSeasonNumber, setCurrentSeasonNumber] = useState(0);
  const [dataMap, setDataMap] = useState<Map<string, string>>(new Map<string, string>());

  const { getMultiSNS } = useQuerySNS();

  const [rankCurrent, setRankCurrent] = useState(RankDirection.default);
  const [rankTotal, setRankTotal] = useState(RankDirection.descend);

  const canUseCityhall = usePermission(PermissionAction.AuditApplication, PermissionObject.ProjectAndGuild);

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

  const displayList = useMemo(() => {
    const newList = [...allList];
    if (rankTotal !== RankDirection.default) {
      newList.sort((a, b) => {
        const a_total = Number(a.season_total_credit);
        const b_total = Number(b.season_total_credit);

        if (rankTotal === RankDirection.descend) {
          return b_total - a_total;
        } else {
          return a_total - b_total;
        }
      });
    }
    if (rankCurrent !== RankDirection.default) {
      newList.sort((a, b) => {
        const a_current = a.seasons_credit.find((item) => item.season_name === currentSeason)?.total || 0;
        const b_current = b.seasons_credit.find((item) => item.season_name === currentSeason)?.total || 0;
        if (rankCurrent === RankDirection.descend) {
          return Number(b_current) - Number(a_current);
        } else {
          return Number(a_current) - Number(b_current);
        }
      });
    }

    return newList;
  }, [allList, rankCurrent, rankTotal]);

  const formatSNS = (wallet: string) => {
    const _sns = dataMap.get(wallet.toLocaleLowerCase()) || wallet;
    return _sns?.endsWith('.seedao') ? _sns : publicJs.AddressToShow(_sns, 4);
  };

  const handleExport = () => {
    ExcellentExport.convert(
      {
        filename: t('GovernanceNodeResult.SCRSeasonRankFilename', { season: currentSeason }),
        format: 'xlsx',
        openAsDownload: true,
      },
      [
        {
          name: t('GovernanceNodeResult.SCRSeasonRankFilename', { season: currentSeason }),
          from: {
            array: [
              ['SNS', ...allSeasons.map((s) => `S${s}(SCR)`), t('GovernanceNodeResult.Total') + '(SCR)'],
              ...displayList.map((item) => [
                dataMap.get(item.wallet) || item.wallet,
                ...allSeasons.map((i) => {
                  return item.seasons_credit?.find((s) => s.season_idx === i)?.total || 0;
                }),
                item.season_total_credit || 0,
              ]),
            ],
          },
          formats: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((c) => ({
            range: `${c}2:${c}1000`,
            format: ExcellentExport.formats.NUMBER,
          })),
        },
      ],
    );
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
          logError(err);
        })
        .finally(() => {
          dispatch({ type: AppActionType.SET_LOADING, payload: false });
        });
    };
    getList();
  }, []);

  const onClickCurrentRank = () => {
    if (rankCurrent === RankDirection.descend) {
      setRankCurrent(RankDirection.ascend);
    } else {
      setRankCurrent(RankDirection.descend);
    }
    setRankTotal(RankDirection.default);
  };

  const onClicktotalRank = () => {
    if (rankTotal === RankDirection.descend) {
      setRankTotal(RankDirection.ascend);
    } else {
      setRankTotal(RankDirection.descend);
    }
    setRankCurrent(RankDirection.default);
  };

  return (
    <OuterBox>
      <BackerNav title={t('GovernanceNodeResult.SCRRank')} to={state || '/home'} mb="16px" />
      {canUseCityhall && (
        <OperateBox>
          <PlainButton onClick={handleExport}>{t('GovernanceNodeResult.Export')}</PlainButton>
        </OperateBox>
      )}

      <TableBox>
        <Table id="head-table">
          <ColGroup seasons={allSeasons} />
          <thead>
            <th className="center">No.</th>
            <th>SNS</th>
            {allSeasons.map((s, i) => {
              return i === allSeasons.length - 1 ? (
                <th key={i} className="right">
                  <ColumnSort onClick={onClickCurrentRank}>
                    <span>{currentSeason} (SCR)</span>
                    <img src={getRankIcon(rankCurrent)} alt="" />
                  </ColumnSort>
                </th>
              ) : (
                <th className="right" key={s}>{`S${s}(SCR)`}</th>
              );
            })}
            <th className="right">
              <ColumnSort onClick={onClicktotalRank}>
                <span>{t('GovernanceNodeResult.Total')}(SCR)</span>
                <img src={getRankIcon(rankTotal)} alt="" />
              </ColumnSort>
            </th>
          </thead>
        </Table>
        <Table id="body-table">
          <ColGroup seasons={allSeasons} />
          <tbody>
            {displayList.map((item, index) => (
              <tr key={item.wallet}>
                <td className="center">{index + 1}</td>
                <td>{formatSNS(item.wallet)}</td>
                {[...allSeasons].map((season) => (
                  <td key={season} className="right">
                    {Number(item.seasons_credit?.find((s) => s.season_idx === season)?.total || 0).format()}
                  </td>
                ))}
                <td className="right">{Number(item.season_total_credit || 0).format()}</td>
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
  margin-bottom: 16px;
`;

const TableBox = styled.div`
  height: calc(100vh - 160px);
  overflow-y: auto;
  .table {
    table-layout: fixed;
    margin-bottom: 0;
    &#head-table {
      position: sticky;
      top: 0;
      th {
        padding-right: 0;
      }
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
    }
    th:first-child {
      padding-left: 0 !important;
    }
    td {
      padding: 0;
      box-sizing: border-box;
      line-height: 74px;
    }
    tr td:first-child {
      padding: 0 !important;
    }
    tr td:last-child {
      padding: 0 20px 0 0 !important;
    }
    th.sticky,
    td.sticky {
      /* position: sticky;
      left: 0; */
    }
  }
`;

const ColumnSort = styled.div`
  display: inline;
  padding: 0 !important;
  background-color: transparent !important;
  color: var(--bs-body-color_active) !important;
  cursor: pointer;

  span {
    font-size: 14px;
    font-family: Poppins-SemiBold, Poppins;
  }
  img {
    width: 20px;
  }
`;
