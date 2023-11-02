import styled from 'styled-components';
import { Button, Form } from 'react-bootstrap';
import React, { useEffect, useMemo, useState } from 'react';
import Page from 'components/pagination';
import requests from 'requests';
import { IApplicantBundleDisplay, ApplicationStatus, IApplicationDisplay } from 'type/application.type';
import Loading from 'components/loading';
import { formatTime } from 'utils/time';
import utils from 'utils/publicJs';
import { IQueryParams } from 'requests/applications';
import NoItem from 'components/noItem';
import publicJs from 'utils/publicJs';
import { useTranslation } from 'react-i18next';
import useToast, { ToastType } from 'hooks/useToast';
import Select from 'components/common/select';
import { formatNumber } from 'utils/number';
import ExpandTable from './expandTable';
import ArrowIconSVG from 'components/svgs/back';
import useQuerySNS from 'hooks/useQuerySNS';
import useSeasons from 'hooks/useSeasons';
import useBudgetSource from 'hooks/useBudgetSource';

const Box = styled.div`
  position: relative;
`;
const TopLine = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  li {
    .tit {
      white-space: nowrap;
      margin-bottom: 16px;
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

const TopBox = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 32px;
  margin-bottom: 20px;
  button {
    height: 40px;
    min-width: 120px;
    &.btn-outline-primary {
      background-color: transparent;
      color: #ff7193;
      border-color: #ff7193;
      &:hover,
      &:active {
        color: #ff7193 !important;
        border-color: #ff7193 !important;
        background-color: transparent !important;
      }
      &.disabled {
        background-color: #b0b0b0;
        color: #0d0c0f;
      }
    }
  }
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 3rem;
  td {
    line-height: 40px;
    .form-check-input {
      position: relative;
      top: 8px;
    }
  }
`;

export default function Register() {
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);
  const [list, setList] = useState<IApplicantBundleDisplay[]>([]);
  const [selectMap, setSelectMap] = useState<{ [id: number]: ApplicationStatus | boolean }>({});
  const [loading, setLoading] = useState(false);

  // budget source
  const allSource = useBudgetSource();
  const [selectSource, setSelectSource] = useState<{ id: number; type: 'project' | 'guild' }>();
  const [applicants, setApplicants] = useState<ISelectItem[]>([]);
  const [selectApplicant, setSelectApplicant] = useState<string>();
  const [showMore, setShowMore] = useState<IApplicationDisplay[]>();

  // season
  const seasons = useSeasons();
  const [selectSeason, setSelectSeason] = useState<number>();

  const { getMultiSNS } = useQuerySNS();

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  const onChangeCheckbox = (value: boolean, id: number) => {
    setSelectMap({ ...selectMap, [id]: value });
  };

  const getApplicants = async () => {
    try {
      const res = await requests.application.getApplicants();
      const options = res.data.map((item) => ({
        label: item.Name || utils.AddressToShow(item.Applicant),
        value: item.Applicant,
      }));
      setApplicants(options);
    } catch (error) {
      console.error('getApplicants error', error);
    }
  };

  useEffect(() => {
    getApplicants();
  }, []);

  const getRecords = async () => {
    setLoading(true);
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
    try {
      const res = await requests.application.getApplicationBundle(
        {
          page,
          size: pageSize,
          sort_field: 'created_at',
          sort_order: 'desc',
        },
        queryData,
      );
      setTotal(res.data.total);

      const _wallets = new Set<string>();
      res.data.rows.forEach((item) => {
        item.records.forEach((r) => {
          _wallets.add(r.submitter_wallet?.toLocaleLowerCase());
          _wallets.add(r.reviewer_wallet?.toLocaleLowerCase());
          _wallets.add(r.target_user_wallet?.toLocaleLowerCase());
        });
      });
      const sns_map = await getMultiSNS(Array.from(_wallets));

      setList(
        res.data.rows.map((item) => ({
          ...item,
          created_date: formatTime(item.submit_date),
          records: item.records.map((record) => ({
            ...record,
            created_date: formatTime(record.created_at),
            transactions: record.transaction_ids.split(','),
            asset_display: formatNumber(Number(record.amount)) + ' ' + record.asset_name,
            submitter_name: sns_map.get(record.submitter_wallet?.toLocaleLowerCase()) as string,
            reviewer_name: sns_map.get(record.reviewer_wallet?.toLocaleLowerCase()) as string,
            receiver_name: sns_map.get(record.target_user_wallet?.toLocaleLowerCase()) as string,
          })),
          submitter_name: sns_map.get(item.submitter?.toLocaleLowerCase()) as string,
          assets_display: item.assets.map((a) => `${formatNumber(Number(a.amount))} ${a.name}`),
        })),
      );
    } catch (error) {
      console.error('getProjectApplications failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecords();
  }, [selectApplicant, selectSource, page, pageSize]);

  const getSelectIds = (): number[] => {
    const ids = Object.keys(selectMap);
    const select_ids: number[] = [];
    for (const id of ids) {
      const _id = Number(id);
      if (selectMap[_id]) {
        select_ids.push(_id);
      }
    }
    return select_ids;
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const select_ids = getSelectIds();
      await requests.application.approveBundles(select_ids);
      getRecords();
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
      setSelectMap({});
    } catch (error) {
      console.error('handle approve failed', error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const select_ids = getSelectIds();
      await requests.application.rejectBundles(select_ids);
      getRecords();
      setSelectMap({});
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
    } catch (error) {
      console.error('handle reject failed', error);
      showToast(t('Msg.ApproveFailed'), ToastType.Danger);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const ids = Object.keys(selectMap);
    const select_ids: number[] = [];
    for (const id of ids) {
      const _id = Number(id);
      if (selectMap[_id]) {
        select_ids.push(_id);
      }
    }
    window.open(requests.application.getExportFileUrl(select_ids), '_blank');
  };

  const onSelectAll = (v: boolean) => {
    const newMap = { ...selectMap };
    list.forEach((item) => {
      newMap[item.id] = v;
    });
    setSelectMap(newMap);
  };

  const selectOne = useMemo(() => {
    const select_ids = getSelectIds();
    return select_ids.length > 0;
  }, [selectMap]);

  const ifSelectAll = useMemo(() => {
    let _is_select_all = true;
    for (const item of list) {
      if (!selectMap[item.id]) {
        _is_select_all = false;
        break;
      }
    }
    return _is_select_all;
  }, [list, selectMap]);

  const formatSNS = (name: string) => {
    return name?.startsWith('0x') ? publicJs.AddressToShow(name) : name;
  };

  return (
    <Box>
      {loading && <Loading />}
      {Toast}
      {showMore ? (
        <ExpandTable handleClose={() => setShowMore(undefined)} list={showMore} />
      ) : (
        <>
          <div>
            <TopLine>
              <li>
                <div className="tit">{t('application.BudgetSource')}</div>
                <FilterSelect
                  options={allSource}
                  placeholder=""
                  onChange={(value: any) => {
                    setSelectSource({ id: value?.value as number, type: value?.data });
                    setSelectMap({});
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
                    setSelectMap({});
                    setPage(1);
                  }}
                />
              </li>
              <li>
                <div className="tit">{t('application.Season')}</div>
                <TimeBox>
                  <BorderBox>
                    <Select
                      width="90px"
                      options={seasons}
                      placeholder=""
                      NotClear={true}
                      onChange={(value: any) => {
                        setSelectSeason(value?.value);
                        setSelectMap({});
                        setPage(1);
                      }}
                    />
                  </BorderBox>

                  <Button onClick={handleExport} disabled={!selectOne} variant="outlined">
                    {t('application.ExportAll')}
                  </Button>
                </TimeBox>
              </li>
            </TopLine>
            <TopBox>
              <Button onClick={handleApprove} disabled={!selectOne}>
                {t('city-hall.Pass')}
              </Button>
              <Button variant="outline-primary" onClick={handleReject} disabled={!selectOne}>
                {t('city-hall.Reject')}
              </Button>
            </TopBox>
          </div>

          <TableBox>
            {list.length ? (
              <>
                <table className="table" cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th className="chech-th">
                        <Form.Check checked={ifSelectAll} onChange={(e) => onSelectAll(e.target.checked)} />
                      </th>
                      <th>{t('application.Time')}</th>
                      <th className="center">{t('application.Season')}</th>
                      <th className="center">{t('application.TotalAssets')}</th>
                      <th>{t('application.RegisterNote')}</th>
                      <th className="center">{t('application.RegisterSource')}</th>
                      <th className="center">{t('application.Operator')}</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <Form.Check
                            checked={!!selectMap[item.id]}
                            onChange={(e: any) => onChangeCheckbox(e.target.checked, item.id)}
                          />
                        </td>
                        <td>{item.created_date}</td>
                        <td className="center">{item.season_name}</td>
                        <td className="center">
                          {item.assets_display.map((asset, idx) => (
                            <div key={idx}>{asset}</div>
                          ))}
                        </td>
                        <td>{item.comment}</td>
                        <td className="center">{item.entity.name}</td>
                        <td className="center">{formatSNS(item.submitter_name)}</td>
                        <td>
                          <TotalCountButton onClick={() => setShowMore(item.records)}>
                            {t('application.TotalCount', { count: item.records.length })}
                            <ArrowIconSVG className="arrow" />
                          </TotalCountButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Page
                  itemsPerPage={pageSize}
                  total={total}
                  current={page - 1}
                  handleToPage={handlePage}
                  handlePageSize={handlePageSize}
                />
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

const FilterSelect = styled(Select)`
  width: 280px;
  @media (max-width: 1240px) {
    width: unset;
  } ;
`;

const TotalCountButton = styled.button`
  min-width: 111px;
  height: 40px;
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
