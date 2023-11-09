import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useTranslation } from 'react-i18next';
import { Table, Form, Button } from 'react-bootstrap';
import { getGovernanceNodeResult, requestSnapshotSeed, requestApproveMintReward } from 'requests/cityHall';
import { useEffect, useMemo, useState } from 'react';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import publicJs from 'utils/publicJs';
import useQuerySNS from 'hooks/useQuerySNS';
import { formatNumber } from 'utils/number';
import ExcellentExport from 'excellentexport';
import { PrimaryOutlinedButton } from 'components/common/button';
import FilterNodesNodal from 'components/modals/filterNodesModal';
import useToast, { ToastType } from 'hooks/useToast';

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
  metaforo_vote_count: string;
}

const ColGroup = () => {
  return (
    <colgroup>
      <col style={{ width: '150px' }} />
      <col style={{ width: '100px' }} />
      <col style={{ width: '100px' }} />
      <col style={{ width: '100px' }} />
      <col style={{ width: '100px' }} />
      <col style={{ width: '120px' }} />
      <col style={{ width: '120px' }} />
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
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [total, setToal] = useState(0);
  const [allList, setAllList] = useState<IRowData[]>([]);
  const [displayList, setDisplayList] = useState<IRowData[]>([]);
  const [dataMap, setDataMap] = useState<Map<string, string>>(new Map<string, string>());
  const [searchKey, setSearchKey] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterResult, setFilterResult] = useState<string[]>([]);

  const [totalWallet, setTotalWallet] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalSCR, setTotalSCR] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [currentSeason, setCurrentSeason] = useState('');

  const [hasSentFlag, setHasSentFlag] = useState(true);
  const [hasSnapshot, setSnapshot] = useState(true);

  const [filterActiveNum, setFilterActiveNum] = useState('');
  const [filterEffectiveNum, setFilterEffectiveNum] = useState('');

  const { getMultiSNS } = useQuerySNS();

  const allSeasons = useMemo(() => {
    if (currentSeason) {
      const current = Number(currentSeason.replace('S', ''));
      return Array.from({ length: current + 1 }, (_, i) => i);
    } else {
      return [];
    }
  }, [currentSeason]);
  console.log('allSeasons', allSeasons);

  useEffect(() => {
    const getList = () => {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });

      getGovernanceNodeResult()
        .then((res) => {
          const data = res.data;
          setToal(data.records.length);
          setAllList(data.records);
          setDisplayList(data.records);

          setTotalWallet(data.total_wallet_count);
          setTotalActive(data.activate_wallet_count);
          setTotalSCR(data.season_total_credit_without_mint);
          setTotalReward(data.season_total_mint_credit);
          setCurrentSeason(data.season_name);

          setHasSentFlag(data.metaforo_confirmed);
          setSnapshot(data.seed_snapshoted);

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

  const formatSNS = (wallet: string) => {
    const sns = dataMap.get(wallet) || wallet;
    return sns.endsWith('.seedao') ? sns : publicJs.AddressToShow(sns, 6);
  };

  const handleExport = () => {
    ExcellentExport.convert({ filename: t('GovernanceNodeResult.FileName'), format: 'xlsx', openAsDownload: true }, [
      {
        name: t('GovernanceNodeResult.SheetName'),
        from: {
          array: [
            [
              'SNS',
              ...allSeasons.map((s) => `S${s}(SCR)`),
              t('GovernanceNodeResult.VoteCount', { season: currentSeason }),
              t('GovernanceNodeResult.MinerReward', { season: currentSeason }) + '(SCR)',
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
              item.metaforo_vote_count || 0,
              item.metaforo_credit || 0,
              item.season_total_credit || 0,
              item.activity_credit || 0,
              item.effective_credit || 0,
              item.seed_count || 0,
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

  const onClickSendReward = async () => {
    try {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      await requestApproveMintReward();
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
      setHasSentFlag(true);
    } catch (error) {
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const onClickSnapshot = async () => {
    try {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      await requestSnapshotSeed();
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
      setSnapshot(true);
    } catch (error) {
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFilterResult([]);
  };

  const handleFilter = () => {
    setShowModal(true);
    setFilterResult(
      allList
        .filter(
          (item) =>
            Number(item.activity_credit) >= Number(filterActiveNum) &&
            Number(item.effective_credit) >= Number(filterEffectiveNum),
        )
        .map((item) => dataMap.get(item.wallet) || item.wallet),
    );
  };

  return (
    <OuterBox>
      {showModal && <FilterNodesNodal snsList={filterResult} handleClose={closeModal} season={currentSeason} />}
      <BackerNav title={t('city-hall.GovernanceNodeResult')} to="/city-hall/governance" />
      <TopLine>
        <StaticCards>
          <li>
            <div>
              <LiTitle>{t('GovernanceNodeResult.TotalSNS')}</LiTitle>
            </div>
            <div className="num">{formatNumber(Number(totalWallet))}</div>
          </li>
          <li>
            <div>
              <LiTitle>{t('GovernanceNodeResult.TotalActiveSNS')}</LiTitle>
            </div>
            <div className="num">{formatNumber(Number(totalActive))}</div>
          </li>
          <li>
            <div>
              <LiTitle>{t('GovernanceNodeResult.TotalSentSCR', { season: currentSeason })}</LiTitle>
            </div>
            <div className="num">{formatNumber(Number(totalSCR))}</div>
          </li>
          <li>
            <div>
              <LiTitle>{t('GovernanceNodeResult.TotalMinerReward', { season: currentSeason })}</LiTitle>
            </div>
            <div className="num">{formatNumber(Number(totalReward))}</div>
          </li>
        </StaticCards>
        <FilterInputBox>
          <FilterInputBoxTop>
            <FilterInputItem>
              <span>{t('GovernanceNodeResult.ActiveSCR')}</span>
              <input type="number" value={filterActiveNum} onChange={(e) => setFilterActiveNum(e.target.value)} />
            </FilterInputItem>
            <FilterInputItem>
              <span>{t('GovernanceNodeResult.EffectiveSCR')}</span>
              <input type="number" value={filterEffectiveNum} onChange={(e) => setFilterEffectiveNum(e.target.value)} />
            </FilterInputItem>
          </FilterInputBoxTop>
          <Button variant="primary" onClick={handleFilter} disabled={!hasSnapshot}>
            {t('GovernanceNodeResult.StartFilter')}
          </Button>
        </FilterInputBox>
      </TopLine>
      <OperateBox>
        <SearchBox>
          <Form.Control
            type="text"
            placeholder={t('GovernanceNodeResult.SearchTip')}
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </SearchBox>
        <ButtonGroup>
          <Button variant="outline-primary" onClick={onClickSnapshot} disabled={hasSnapshot}>
            {t('GovernanceNodeResult.SeedSnapshot')}
          </Button>
          <PrimaryOutlinedButton
            onClick={onClickSendReward}
            disabled={hasSentFlag}
            style={{ height: '40px', lineHeight: '40px' }}
          >
            {t('GovernanceNodeResult.SendReward')}
          </PrimaryOutlinedButton>
          <Button variant="primary" onClick={handleExport}>
            {t('GovernanceNodeResult.Export')}
          </Button>
        </ButtonGroup>
      </OperateBox>
      <TableBox>
        <Table id="head-table">
          <ColGroup />
          <thead>
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
            <th>{t('GovernanceNodeResult.VoteCount', { season: currentSeason })}</th>
            <th>{t('GovernanceNodeResult.MinerReward', { season: currentSeason })}(SCR)</th>
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
                {[...allSeasons].map((season) => (
                  <td key={season}>
                    {formatNumber(Number(item.seasons_credit?.find((s) => s.season_idx === season)?.total || 0))}
                  </td>
                ))}

                <td>{formatNumber(Number(item.metaforo_vote_count) || 0)}</td>
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
  height: calc(100vh - 380px);
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
  @media (max-width: 1520px) {
    height: calc(100vh - 440px);
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

const TopLine = styled.div`
  display: flex;
  margin-bottom: 30px;
  gap: 20px;
  justify-content: space-between;
  @media (max-width: 1520px) {
    flex-direction: column;
  }
`;
const StaticCards = styled.ul`
  display: flex;
  gap: 20px;
  li {
    min-width: 180px;
    border-radius: 16px;
    padding: 20px 25px;
    background-color: var(--bs-box--background);
    border: 1px solid var(--bs-border-color);
    .num {
      color: var(--bs-body-color_active);
      margin-top: 10px;
    }
  }
`;

const FilterInputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 1520px) {
    flex-direction: row;
  }
`;

const FilterInputBoxTop = styled.div`
  display: flex;
  border: 1px solid var(--bs-border-color);
  border-radius: 16px;
  height: 40px;
`;

const FilterInputItem = styled.div`
  padding-inline: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  &:first-child {
    border-right: 1px solid var(--bs-border-color);
  }
  input {
    width: 90px;
    height: 40px;
    line-height: 40px;
    border: none;
    background-color: transparent;
    padding-left: 10px;
  }
  input:focus-visible {
    outline: none;
  }
`;

const LiTitle = styled.div`
  color: var(--bs-body-color);
  line-height: 18px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`;
