import styled from 'styled-components';
import React, { useEffect, useMemo, useState } from 'react';
import Page from 'components/pagination';
import requests from 'requests';
import { IApplicantBundleDisplay, ApplicationStatus, IApplicationDisplay } from 'type/application.type';
import { formatTime } from 'utils/time';
import utils from 'utils/publicJs';
import { IQueryParams } from 'requests/applications';
import NoItem from 'components/noItem';
import publicJs from 'utils/publicJs';
import { useTranslation } from 'react-i18next';
import useToast, { ToastType } from 'hooks/useToast';
import Select from 'components/common/select';
import { formatNumber } from 'utils/number';
import ExpandTable from '../../../components/cityHallCom/expandTable';
import ArrowIconSVG from 'components/svgs/back';
import useQuerySNS from 'hooks/useQuerySNS';
import useSeasons from 'hooks/useSeasons';
import useBudgetSource from 'hooks/useBudgetSource';
import BackerNav from 'components/common/backNav';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ContainerPadding } from 'assets/styles/global';
import ApplicationStatusTag from 'components/common/applicationStatusTagNew';
import useApplicants from 'hooks/useApplicants';
import { formatApplicationStatus } from 'utils';

const Box = styled.div`
  position: relative;
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
`;
const TopLine = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 24px;
  li {
    .tit {
      white-space: nowrap;
      margin-bottom: 16px;
      font-size: 14px;
    }
  }
`;

const BorderBox = styled.div``;

const TimeBox = styled.div`
  display: flex;
  gap: 18px;
  button.btn {
    border-color: var(--bs-primary);
    color: var(--bs-primary);
    &:disabled {
    }
  }
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 3rem;
  td {
    &:nth-child(4) {
      width: 20%;
    }
    line-height: 54px;
    vertical-align: middle;
    .form-check-input {
      position: relative;
      top: 8px;
    }
  }
`;

export default function Register() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);
  const [list, setList] = useState<IApplicantBundleDisplay[]>([]);

  // budget source
  const allSource = useBudgetSource();
  const [selectSource, setSelectSource] = useState<{ id: number; type: 'project' | 'guild' }>();
  // applicant
  const applicants = useApplicants();
  const [selectApplicant, setSelectApplicant] = useState<string>();
  // State
  const allStates = useMemo(() => {
    return [
      { value: ApplicationStatus.Open, label: t(formatApplicationStatus(ApplicationStatus.Open)) },
      { value: ApplicationStatus.Rejected, label: t(formatApplicationStatus(ApplicationStatus.Rejected)) },
      { value: ApplicationStatus.Approved, label: t(formatApplicationStatus(ApplicationStatus.Approved)) },
    ];
  }, [t]);
  const [selectState, setSelectState] = useState<ApplicationStatus>();
  // season
  const seasons = useSeasons();
  const selectSeason = seasons.length ? seasons[seasons.length - 1].value : undefined;

  const [showMore, setShowMore] = useState<IApplicationDisplay[]>();
  const [showBundleId, setShowBundleId] = useState<number>();
  const [bundleStatus, setShowBundleStatus] = useState<ApplicationStatus>();
  const [applyIntro, setApplyIntro] = useState('');

  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const { getMultiSNS } = useQuerySNS();

  const showLoading = (v: boolean) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: v });
  };

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  const handleSNS = async (wallets: string[]) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  const getRecords = async () => {
    showLoading(true);
    const queryData: IQueryParams = {
      //   state: ApplicationStatus.Open,
    };
    if (selectApplicant) queryData.applicant = selectApplicant;
    if (selectSource && selectSource.type) {
      queryData.entity_id = selectSource.id;
      queryData.entity = selectSource.type;
    }
    if (selectSeason) {
      queryData.season_id = selectSeason;
    }
    if (selectState) {
      queryData.state = selectState;
    }
    try {
      const res = await requests.application.getApplicationBundle(
        {
          page,
          size: pageSize,
          sort_field: 'create_ts',
          sort_order: 'desc',
        },
        queryData,
      );
      setTotal(res.data.total);

      const _wallets = new Set<string>();
      res.data.rows.forEach((item) => {
        item.records.forEach((r) => {
          r.applicant_wallet && _wallets.add(r.applicant_wallet?.toLocaleLowerCase());
          _wallets.add(r.reviewer_wallet?.toLocaleLowerCase());
          r.target_user_wallet && _wallets.add(r.target_user_wallet?.toLocaleLowerCase());
        });
      });
      handleSNS(Array.from(_wallets));
      setList(
        res.data.rows.map((item) => ({
          ...item,
          created_date: formatTime(item.apply_ts * 1000),
          records: item.records.map((record) => ({
            ...record,
            created_date: formatTime(record.create_ts * 1000),
            transactions: record.transaction_ids.split(','),
            asset_display: formatNumber(Number(record.amount)) + ' ' + record.asset_name,
          })),
          assets_display: item.assets.map((a) => `${formatNumber(Number(a.amount))} ${a.name}`),
        })),
      );
    } catch (error) {
      console.error('getProjectApplications failed', error);
    } finally {
      showLoading(false);
    }
  };

  useEffect(() => {
    selectSeason && getRecords();
  }, [selectState, selectApplicant, selectSource, selectSeason, page, pageSize]);

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 6);
  };

  const handleclose = () => {
    setShowMore(undefined);
    setShowBundleId(undefined);
    setShowBundleStatus(undefined);
    setApplyIntro('');
  };
  const updateStatus = (status: ApplicationStatus) => {
    if (!showMore) {
      return;
    }
    setShowMore([...showMore.map((r) => ({ ...r, status }))]);
    setShowBundleStatus(status);
    getRecords();
  };

  return (
    <Box>
      {showMore && showBundleId ? (
        <ExpandTable
          bund_id={showBundleId}
          status={bundleStatus}
          list={showMore}
          handleClose={handleclose}
          updateStatus={updateStatus}
          showLoading={showLoading}
          applyIntro={applyIntro}
        />
      ) : (
        <>
          <BackerNav title={t('city-hall.PointsAndTokenAudit')} to="/city-hall/governance" />

          <TopLine>
            <li>
              <div className="tit">{t('application.BudgetSource')}</div>
              <FilterSelect
                options={allSource}
                placeholder=""
                onChange={(value: any) => {
                  setSelectSource({ id: value?.value as number, type: value?.data });
                  setPage(1);
                }}
              />
            </li>
            <li>
              <div className="tit">{t('application.Operator')}</div>
              <FilterSelect
                options={applicants}
                placeholder=""
                onChange={(value: ISelectItem) => {
                  setSelectApplicant(value?.value);
                  setPage(1);
                }}
              />
            </li>
            <li>
              <div className="tit">{t('application.State')}</div>
              <Select
                width="150px"
                options={allStates}
                placeholder=""
                onChange={(value: any) => {
                  setSelectState(value?.value);
                  setPage(1);
                }}
              />
            </li>
          </TopLine>

          <TableBox>
            {list.length ? (
              <>
                <table className="table" cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th className="center">{t('application.BudgetSource')}</th>
                      <th className="center">{t('application.TotalAssets')}</th>
                      <th>{t('application.State')}</th>
                      <th>{t('application.ApplyIntro')}</th>
                      <th className="center">{t('application.Operator')}</th>
                      <th className="center">{t('application.ApplyTime')}</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item) => (
                      <tr key={item.id}>
                        <td className="center">
                          <CommentBox>{item.entity.name}</CommentBox>
                        </td>
                        <td className="center">
                          <TotalAssets>
                            {item.assets_display.map((asset, idx) => (
                              <div key={idx}>{asset}</div>
                            ))}
                          </TotalAssets>
                        </td>
                        <td>
                          <ApplicationStatusTag status={item.state} />
                        </td>
                        <td>
                          <CommentBox>{item.comment}</CommentBox>
                        </td>
                        <td className="center">{formatSNS(item.applicant)}</td>
                        <td className="center">{item.created_date}</td>
                        <td>
                          <TotalCountButton
                            onClick={() => {
                              setShowMore(item.records);
                              setShowBundleId(item.id);
                              setShowBundleStatus(item.state);
                              setApplyIntro(item.comment);
                            }}
                          >
                            {t('application.TotalCount', { count: item.records.length })}
                            <ArrowIconSVG className="arrow" />
                          </TotalCountButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {total > pageSize && (
                  <Page
                    itemsPerPage={pageSize}
                    total={total}
                    current={page - 1}
                    handleToPage={handlePage}
                    handlePageSize={handlePageSize}
                  />
                )}
              </>
            ) : (
              <NoItem />
            )}
          </TableBox>
        </>
      )}
    </Box>
  );
}

const CommentBox = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;

  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
`;
const FilterSelect = styled(Select)`
  width: 200px;
  @media (max-width: 1240px) {
    width: unset;
  } ;
`;

const TotalCountButton = styled.button`
  min-width: 111px;
  height: 40px;
  line-height: 40px;
  background: var(--bs-background);
  border-radius: 8px;
  opacity: 1;
  border: 1px solid var(--bs-svg-color);
  text-align: center;
  .arrow {
    transform: rotate(180deg);
    position: relative;
    top: -1px;
  }
`;

const TotalAssets = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  line-height: 20px;
  box-sizing: border-box;
  height: 100%;
`;
