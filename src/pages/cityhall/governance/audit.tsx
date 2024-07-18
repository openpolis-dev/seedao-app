import styled from 'styled-components';
import React, { useEffect, useMemo, useState } from 'react';
import Page from 'components/pagination';
import requests from 'requests';
import {
  IApplicantBundleDisplay,
  ApplicationStatus,
  IApplicationDisplay,
  ApplicationEntity,
} from 'type/application.type';
import { formatTime } from 'utils/time';
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
import sns from '@seedao/sns-js';
import { ethers } from 'ethers';

import SearchImg from 'assets/Imgs/light/search.svg';
import SearchWhite from 'assets/Imgs/light/search.svg';
import ClearSVGIcon from 'components/svgs/clear';

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
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);
  const [list, setList] = useState<IApplicantBundleDisplay[]>([]);

  // budget source
  const allSource = useBudgetSource();
  const [selectSource, setSelectSource] = useState<{ id: number; type: ApplicationEntity }>();

  // search applicant
  const [applicantKeyword, setApplicantKeyword] = useState('');
  const [searchApplicantVal, setSearchApplicantVal] = useState('');
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
  // process flag
  const [isProcessing, setIsProcessing] = useState(true);

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

  const checkProcessStatus = async () => {
    const res = await requests.application.getProjectApplications(
      {
        page: 1,
        size: 1,
        sort_field: 'create_ts',
        sort_order: 'desc',
      },
      {
        state: ApplicationStatus.Processing,
      },
    );
    setIsProcessing(!!res.data.rows.length);
  };

  const getRecords = async () => {
    showLoading(true);
    const queryData: IQueryParams = {
      //   state: ApplicationStatus.Open,
    };
    if (searchApplicantVal) queryData.applicant = searchApplicantVal;
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
      const arr = Array.from(_wallets).filter((item) => item);

      handleSNS(arr);
      setList(
        res.data.rows.map((item) => ({
          ...item,
          created_date: formatTime(item.apply_ts * 1000),
          records: item.records.map((record) => ({
            ...record,
            review_date: formatTime(record.review_ts * 1000),
            created_date: formatTime(record.create_ts * 1000),
            complete_date: formatTime(record.complete_ts * 1000),
            transactions: record.transaction_ids.split(','),
            asset_display: Number(record.amount).format() + ' ' + record.asset_name,
            app_bundle_comment: item.comment,
          })),
          assets_display: item.assets.map((a) => `${Number(a.amount).format()} ${a.name}`),
        })),
      );
    } catch (error) {
      logError('getProjectApplications failed', error);
    } finally {
      showLoading(false);
    }
  };

  useEffect(() => {
    checkProcessStatus();
  }, []);

  useEffect(() => {
    selectSeason && getRecords();
  }, [selectState, searchApplicantVal, selectSource, selectSeason, page, pageSize]);

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet.toLowerCase()) || wallet;
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
    } else {
      showToast(t('Msg.InvalidAddress', { address: keyword }), ToastType.Danger);
    }
  };

  const onKeyUp = (e: any, type: string) => {
    if (e.keyCode === 13) {
      // document.activeElement.blur();
      switch (type) {
        case 'applicant':
          handleSearch(applicantKeyword, setSearchApplicantVal);
          break;
        default:
          return;
      }
    }
  };
  const clearSearch = (type: string) => {
    switch (type) {
      case 'applicant':
        setSearchApplicantVal('');
        setApplicantKeyword('');
        break;
      default:
        return;
    }
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
          isProcessing={isProcessing}
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
            <li>
              <div className="tit">{t('application.Operator')}</div>
              <SearchBox>
                <img src={theme ? SearchWhite : SearchImg} alt="" />
                <input
                  type="text"
                  placeholder={t('application.SearchApplicantHint')}
                  onKeyUp={(e) => onKeyUp(e, 'applicant')}
                  value={applicantKeyword}
                  onChange={(e) => setApplicantKeyword(e.target.value)}
                />
                {applicantKeyword && <ClearSVGIcon onClick={() => clearSearch('applicant')} />}
              </SearchBox>
            </li>
          </TopLine>

          <TableBox>
            {list.length ? (
              <>
                <table className="table" cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>{t('application.BudgetSource')}</th>
                      <th className="right">{t('application.TotalAssets')}</th>
                      <th className="center">{t('application.State')}</th>
                      <th>{t('application.ApplyIntro')}</th>
                      <th>{t('application.Operator')}</th>
                      <th>{t('application.ApplyTime')}</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <CommentBox>{item.entity.name}</CommentBox>
                        </td>
                        <td className="right">
                          <TotalAssets>
                            {item.assets_display.map((asset, idx) => (
                              <div key={idx}>{asset}</div>
                            ))}
                          </TotalAssets>
                        </td>
                        <td className="center">
                          <ApplicationStatusTag status={item.state} />
                        </td>
                        <td>
                          <CommentBox>{item.comment}</CommentBox>
                        </td>
                        <td>{formatSNS(item.applicant)}</td>
                        <td>{item.created_date}</td>
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
  word-break: break-word;

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

const SearchBox = styled.div`
  width: 200px;
  height: 40px;
  background: var(--bs-box-background);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid var(--bs-border-color);
  input {
    width: calc(100% - 30px);
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
