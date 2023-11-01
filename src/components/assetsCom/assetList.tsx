import styled from 'styled-components';
import { Button, Form, Table } from 'react-bootstrap';

import React, { useState, useEffect, useMemo } from 'react';
import Page from 'components/pagination';
import requests from 'requests';
import { IQueryParams } from 'requests/applications';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import utils from 'utils/publicJs';
import NoItem from 'components/noItem';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import Loading from 'components/loading';
import { formatTime } from 'utils/time';
import publicJs from 'utils/publicJs';
import { useTranslation } from 'react-i18next';
import { formatApplicationStatus } from 'utils/index';
import Select from 'components/common/select';
import { formatNumber } from 'utils/number';
import ApplicationModal from 'components/modals/applicationModal';
import ApplicationStatusTag from 'components/common/applicationStatusTag';
import useSeasons from 'hooks/useSeasons';
import useQuerySNS from 'hooks/useQuerySNS';

const Box = styled.div``;
const TitBox = styled.div`
  margin: 40px 0 26px;
  font-size: 24px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  line-height: 30px;
`;

const FirstLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: end;
  margin-bottom: 20px;
  .btn-export {
    min-width: 111px;
  }
  @media (max-width: 1100px) {
    justify-content: flex-start;
    flex-direction: column;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 1000px) {
    justify-content: space-between;
    flex-direction: row;
    align-items: end;
  }
`;

const TopLine = styled.ul`
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 24px;
  li {
    display: flex;
    flex-direction: column;
    > span {
      margin-bottom: 10px;
    }
    .tit {
      padding-right: 20px;
      white-space: nowrap;
    }
  }
  @media (max-width: 1100px) {
    width: 100%;
  }
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 3rem;
`;

export default function AssetList() {
  const {
    state: { loading },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>();
  const [selectMap, setSelectMap] = useState<{ [id: number]: ApplicationStatus | boolean }>({});
  const [applicants, setApplicants] = useState<ISelectItem[]>([]);
  const [selectApplicant, setSelectApplicant] = useState<string>();
  const [allSource, setAllSource] = useState<ISelectItem[]>([]);
  const [selectSource, setSelectSource] = useState<{ id: number; type: 'project' | 'guild' }>();
  const [detailDisplay, setDetailDisplay] = useState<IApplicationDisplay>();
  // season
  const seasons = useSeasons();
  const [selectSeason, setSelectSeason] = useState<number>();

  const statusOption = useMemo(() => {
    return [
      { label: t(formatApplicationStatus(ApplicationStatus.Open)), value: ApplicationStatus.Open },
      { label: t(formatApplicationStatus(ApplicationStatus.Rejected)), value: ApplicationStatus.Rejected },
      { label: t(formatApplicationStatus(ApplicationStatus.Approved)), value: ApplicationStatus.Approved },
      { label: t(formatApplicationStatus(ApplicationStatus.Processing)), value: ApplicationStatus.Processing },
      { label: t(formatApplicationStatus(ApplicationStatus.Completed)), value: ApplicationStatus.Completed },
    ];
  }, [t]);

  const { getMultiSNS } = useQuerySNS();

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  const onChangeCheckbox = (value: boolean, id: number, status: ApplicationStatus) => {
    setSelectMap({ ...selectMap, [id]: value && status });
  };

  const getProjects = async () => {
    try {
      const res = await requests.project.getProjects({
        page: 1,
        size: 1000,
        sort_order: 'desc',
        sort_field: 'created_at',
      });
      return res.data.rows.map((item) => ({
        label: item.name,
        value: item.id,
        data: 'project',
      }));
    } catch (error) {
      console.error('getProjects in city-hall failed: ', error);
      return [];
    }
  };
  const getGuilds = async () => {
    try {
      const res = await requests.guild.getProjects({
        page: 1,
        size: 1000,
        sort_order: 'desc',
        sort_field: 'created_at',
      });
      return res.data.rows.map((item) => ({
        label: item.name,
        value: item.id,
        data: 'guild',
      }));
    } catch (error) {
      console.error('getGuilds in city-hall failed: ', error);
      return [];
    }
  };

  const getSources = async () => {
    const projects = await getProjects();
    const guilds = await getGuilds();
    setAllSource([...projects, ...guilds]);
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
    getSources();
  }, []);

  useEffect(() => {
    getApplicants();
  }, []);

  const getRecords = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const queryData: IQueryParams = {};
      if (selectStatus) queryData.state = selectStatus;
      if (selectApplicant) queryData.applicant = selectApplicant;
      if (selectSeason) {
        queryData.season_id = selectSeason;
      }
      if (selectSource && selectSource.type) {
        queryData.entity_id = selectSource.id;
        queryData.entity = selectSource.type;
      }

      const res = await requests.application.getApplications(
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
        _wallets.add(item.target_user_wallet);
        _wallets.add(item.submitter_wallet);
        _wallets.add(item.reviewer_wallet);
      });
      const sns_map = await getMultiSNS(Array.from(_wallets));

      const _list = res.data.rows.map((item, idx) => ({
        ...item,
        created_date: formatTime(item.created_at),
        transactions: item.transaction_ids.split(','),
        asset_display: formatNumber(Number(item.amount)) + ' ' + item.asset_name,
        submitter_name: sns_map.get(item.submitter_wallet?.toLocaleLowerCase()) as string,
        reviewer_name: sns_map.get(item.reviewer_wallet?.toLocaleLowerCase()) as string,
        receiver_name: sns_map.get(item.target_user_wallet?.toLocaleLowerCase()) as string,
      }));
      setList(_list);
    } catch (error) {
      console.error('getRecords error', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    getRecords();
  }, [selectSeason, selectStatus, selectApplicant, page, pageSize, selectSource]);

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

  const handleExport = async () => {
    const select_ids = getSelectIds();
    window.open(requests.application.getExportFileUrl(select_ids), '_blank');
  };

  const onSelectAll = (v: boolean) => {
    const newMap = { ...selectMap };
    list.forEach((item) => {
      newMap[item.application_id] = v && item.status;
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
      if (!selectMap[item.application_id]) {
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
      {detailDisplay && (
        <ApplicationModal application={detailDisplay} handleClose={() => setDetailDisplay(undefined)} />
      )}
      {loading && <Loading />}

      <TitBox>{t('Project.Record')}</TitBox>
      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">{t('Project.State')}</span>
            <Select
              options={statusOption}
              placeholder=""
              onChange={(value: any) => {
                setSelectStatus(value?.value as ApplicationStatus);
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
          <li>
            <span className="tit">{t('application.BudgetSource')}</span>
            <Select
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
            <span className="tit">{t('application.Operator')}</span>
            <Select
              options={applicants}
              placeholder=""
              onChange={(value: any) => {
                setSelectApplicant(value?.value);
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
          <li>
            <span className="tit">{t('application.Season')}</span>
            <Select
              options={seasons}
              placeholder=""
              onChange={(value: any) => {
                setSelectSeason(value?.value);
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
        </TopLine>
        <div>
          <Button onClick={handleExport} disabled={!selectOne} className="btn-export">
            {t('Project.Export')}
          </Button>
        </div>
      </FirstLine>

      <TableBox>
        {list.length ? (
          <>
            <Table responsive>
              <thead>
                <tr>
                  <th className="chech-th">
                    <Form.Check checked={ifSelectAll} onChange={(e) => onSelectAll(e.target.checked)} />
                  </th>
                  <th>{t('application.Receiver')}</th>
                  <th className="center">{t('application.AddAssets')}</th>
                  <th className="center">{t('application.Season')}</th>
                  <th>{t('application.Content')}</th>
                  <th className="center">{t('application.BudgetSource')}</th>
                  <th className="center">{t('application.Operator')}</th>
                  <th>{t('application.State')}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.application_id} onClick={() => setDetailDisplay(item)}>
                    <td>
                      <Form.Check
                        checked={!!selectMap[item.application_id]}
                        onChange={(e) => onChangeCheckbox(e.target.checked, item.application_id, item.status)}
                      />
                    </td>
                    <td>{formatSNS(item.receiver_name || '')}</td>
                    <td className="center">{item.asset_display}</td>
                    <td className="center">{item.season_name}</td>
                    <td>{item.detailed_type}</td>
                    <td className="center">{item.budget_source}</td>
                    <td className="center">{formatSNS(item.submitter_name)}</td>
                    <td>
                      <ApplicationStatusTag status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
    </Box>
  );
}
