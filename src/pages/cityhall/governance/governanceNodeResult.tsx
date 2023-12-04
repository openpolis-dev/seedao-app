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
import { Row, Col } from 'react-bootstrap';
import SearchImg from 'assets/Imgs/light/search.svg';
import SearchWhite from 'assets/Imgs/dark/search.svg';

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

const ColGroup = ({ seasons }: { seasons: number[] }) => {
  return (
    <colgroup>
      {/* sns */}
      <col style={{ width: '150px' }} />
      {/* seasons */}
      {seasons.map((s) => (
        <col style={{ width: '100px' }} key={s} />
      ))}
      {/* vote */}
      <col style={{ width: '100px' }} />
      {/* season reward */}
      <col style={{ width: '120px' }} />
      {/* total */}
      <col style={{ width: '120px' }} />
      {/* active */}
      <col style={{ width: '120px' }} />
      {/* effective */}
      <col style={{ width: '120px' }} />
      {/* seed */}
      <col style={{ width: '150px' }} />
    </colgroup>
  );
};

export default function GoveranceNodeResult() {
  const { t } = useTranslation();
  const {
    state: { theme },
    dispatch,
  } = useAuthContext();
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
  const [currentSeasonNumber, setCurrentSeasonNumber] = useState(0);

  const [hasSentFlag, setHasSentFlag] = useState(true);
  const [hasSnapshot, setSnapshot] = useState(true);

  const [filterActiveNum, setFilterActiveNum] = useState('');
  const [filterEffectiveNum, setFilterEffectiveNum] = useState('');

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
          setCurrentSeasonNumber(Number(data.season_name.replace('S', '')));

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
              ...allSeasons.map((i) => {
                return item.seasons_credit?.find((s) => s.season_idx === i)?.total || 0;
              }),
              item.metaforo_vote_count || 0,
              item.metaforo_credit || 0,
              item.season_total_credit || 0,
              item.activity_credit || 0,
              item.effective_credit || 0,
              item.seed_count || 0,
            ]),
          ],
        },
        formats: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'].map((c) => ({
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
            Number(item.effective_credit) >= Number(filterEffectiveNum) &&
            item.seed_count > 0,
        )
        .map((item) => item.wallet),
    );
  };

  return (
    <OuterBox>
      {showModal && (
        <FilterNodesNodal
          filterActiveNum={formatNumber(Number(filterActiveNum))}
          filterEffectiveNum={formatNumber(Number(filterEffectiveNum))}
          walletList={filterResult}
          handleClose={closeModal}
          season={`S${currentSeasonNumber + 1}`}
        />
      )}
      <BackerNav title={t('city-hall.GovernanceNodeResult')} to="/city-hall/governance" mb="24px" />
      <TopLine>
        <StaticCards>
          <Col md={2}>
            <div className="li">
              <div className="num f1">{formatNumber(Number(totalWallet))}</div>
              <div>
                <LiTitle>{t('GovernanceNodeResult.TotalSNS')}</LiTitle>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="li">
              <div className="num f2">{formatNumber(Number(totalActive))}</div>
              <div>
                <LiTitle>{t('GovernanceNodeResult.TotalActiveSNS')}</LiTitle>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="li">
              <div className="num f3">{Number(totalSCR).format()}</div>
              <div>
                <LiTitle>{t('GovernanceNodeResult.TotalSentSCR', { season: currentSeason })}</LiTitle>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="li">
              <div className="num f4">{Number(totalReward).format()}</div>
              <div>
                <LiTitle>{t('GovernanceNodeResult.TotalMinerReward', { season: currentSeason })}</LiTitle>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <FilterInputBox>
              <FilterInputBoxTop>
                <FilterInputItem>
                  <span>{t('GovernanceNodeResult.ActiveSCR')}</span>
                  <input
                    type="number"
                    value={filterActiveNum}
                    onChange={(e) => setFilterActiveNum(e.target.value)}
                    placeholder={t('general.Placeholder')}
                  />
                </FilterInputItem>
                <FilterInputItem>
                  <span>{t('GovernanceNodeResult.EffectiveSCR')}</span>
                  <input
                    type="number"
                    value={filterEffectiveNum}
                    onChange={(e) => setFilterEffectiveNum(e.target.value)}
                    placeholder={t('general.Placeholder')}
                  />
                </FilterInputItem>
              </FilterInputBoxTop>
              <Button variant="primary" onClick={handleFilter} disabled={!hasSnapshot}>
                {t('GovernanceNodeResult.StartFilter')}
              </Button>
            </FilterInputBox>
          </Col>
        </StaticCards>
      </TopLine>
      <OperateBox>
        <SearchBox>
          <img src={SearchImg} alt="" />
          <Form.Control
            type="text"
            placeholder={t('GovernanceNodeResult.SearchTip')}
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </SearchBox>
        <ButtonGroup>
          <Button variant="primary" onClick={onClickSnapshot} disabled={hasSnapshot}>
            {t('GovernanceNodeResult.SeedSnapshot')}
          </Button>
          <PrimaryOutlinedButton
            onClick={onClickSendReward}
            disabled={hasSentFlag}
            style={{ height: '40px', lineHeight: '40px' }}
          >
            {t('GovernanceNodeResult.SendReward')}
          </PrimaryOutlinedButton>
          <Button className="export" variant="outline-secondary" onClick={handleExport}>
            {t('GovernanceNodeResult.Export')}
          </Button>
        </ButtonGroup>
      </OperateBox>
      <TableBox>
        <Table id="head-table">
          <ColGroup seasons={allSeasons} />
          <thead>
            <th>SNS</th>
            {allSeasons.map((s, i) => {
              return i === allSeasons.length - 1 ? (
                <th className="right">
                  <CurrentSeason>{currentSeason}</CurrentSeason>(SCR)
                </th>
              ) : (
                <th key={s} className="right">{`S${s}(SCR)`}</th>
              );
            })}
            <th className="center">{t('GovernanceNodeResult.VoteCount', { season: currentSeason })}</th>
            <th className="right">{t('GovernanceNodeResult.MinerReward', { season: currentSeason })}(SCR)</th>
            <th className="right">{t('GovernanceNodeResult.Total')}(SCR)</th>
            <th className="right">{t('GovernanceNodeResult.ActiveSCR')}</th>
            <th className="right">{t('GovernanceNodeResult.EffectiveSCR')}</th>
            <th className="center">{t('GovernanceNodeResult.SeedCount')}</th>
          </thead>
        </Table>
        <Table id="body-table">
          <ColGroup seasons={allSeasons} />
          <tbody>
            {displayList.map((item, index) => (
              <tr key={item.wallet}>
                <td>{formatSNS(item.wallet)}</td>
                {[...allSeasons].map((season) => (
                  <td key={season} className="right">
                    {Number(item.seasons_credit?.find((s) => s.season_idx === season)?.total || 0).format()}
                  </td>
                ))}

                <td className="center">{Number(item.metaforo_vote_count).format()}</td>
                <td className="right">{Number(item.metaforo_credit).format()}</td>
                <td className="right">{Number(item.season_total_credit).format()}</td>
                <td className="right">{Number(item.activity_credit).format()}</td>
                <td className="right">{Number(item.effective_credit).format()}</td>
                <td className="center">{item.seed_count}</td>
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
  .backTitle {
    font-size: 14px;
    font-weight: 400;
    color: var(--bs-body-color_active);
    line-height: 20px;
  }
`;

const OperateBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const SearchBox = styled.div`
  width: 320px;
  height: 40px;
  position: relative;
  img {
    width: 24px;
    height: 24px;
    position: absolute;
    left: 8px;
    top: 8px;
  }
  input {
    height: 40px;
    box-sizing: border-box;
    padding-left: 40px;
    &::placeholder {
      color: #b0b0b0;
    }
  }
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
    td {
      padding: 0;
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
  @media (max-width: 1470px) {
    height: calc(100vh - 400px);
  }
  @media (max-width: 1440px) {
    height: calc(100vh - 380px);
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
  margin-bottom: 30px;
  @media (max-width: 1520px) {
    flex-direction: column;
  }
`;
const StaticCards = styled(Row)`
  .li {
    min-height: 106px;
    border-radius: 16px;
    padding: 25px 16px;
    background-color: var(--bs-box--background);
    border: 1px solid var(--border-box);
    box-shadow: var(--box-shadow);
    height: 100%;
    .num {
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
      margin-bottom: 6px;
    }
  }
  .f1 {
    color: #5200ff;
  }
  .f2 {
    color: #1f9e14;
  }
  .f3 {
    color: #1da1f2;
  }
  .f4 {
    color: #ff7193;
  }
`;

const FilterInputBox = styled.div`
  height: 100%;
  display: flex;
  border-radius: 16px;
  padding: 13px 15px 4px;
  background-color: var(--bs-box--background);
  border: 1px solid var(--border-box);
  box-shadow: var(--box-shadow);
  align-items: center;
  .btn {
    width: 95px;
    font-size: 14px !important;
  }
  @media (max-width: 1520px) {
    flex-direction: row;
  }
`;

const FilterInputBoxTop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const FilterInputItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 30px 9px 10px;
  flex-grow: 1;
  font-size: 12px;
  input {
    height: 32px;
    background-color: transparent;
    padding-left: 10px;
    border-radius: 8px;
    border: 1px solid rgba(217, 217, 217, 0.5);
    flex-grow: 1;
    margin-left: 17px;
  }
  input:focus-visible {
    outline: none;
  }
`;

const LiTitle = styled.div`
  color: var(--bs-body-color);
  line-height: 18px;
  font-size: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  .btn {
    width: 130px !important;
  }
  .export {
    border: 1px solid var(--bs-border-color);
  }
`;
