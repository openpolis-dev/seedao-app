import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import Select from '@paljs/ui/Select';
import React, { useEffect, useMemo, useState } from 'react';
import Page from 'components/pagination';
import RangeDatePickerStyle from 'components/rangeDatePicker';
import { Checkbox } from '@paljs/ui/Checkbox';
import requests from 'requests';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import Loading from 'components/loading';
import { formatDate, formatTime } from 'utils/time';
import utils from 'utils/publicJs';
import { IQueryParams } from 'requests/applications';
import NoItem from 'components/noItem';
import publicJs from 'utils/publicJs';
import CopyBox from 'components/copy';
import { EvaIcon } from '@paljs/ui/Icon';
import useTranslation from 'hooks/useTranslation';

const Box = styled.div``;
const FirstLine = styled.div`
  display: flex;
  //flex-direction: column;
  margin: 40px 0 20px;
  align-items: center;
  flex-wrap: wrap;

  //justify-content: space-between;
`;

const TopLine = styled.ul`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  li {
    display: flex;
    align-items: center;
    margin-right: 40px;

    .tit {
      padding-right: 20px;
    }

    .sel {
      min-width: 150px;
    }
  }
`;

const TimeLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const TimeBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const BorderBox = styled.div`
  border: 1px solid #eee;
  padding: 10px 20px;
  border-radius: 5px;
`;

const MidBox = styled.div`
  margin: 0 20px;
`;

const TopBox = styled.div`
  background: #f5f5f5;
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  margin: 0 0 30px;
  button {
    margin-left: 20px;
  }
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;

export default function Audit() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndData] = useState<Date>();
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectMap, setSelectMap] = useState<{ [id: number]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const [allSource, setAllSource] = useState<ISelectItem[]>([]);
  const [selectSource, setSelectSource] = useState<{ id: number; type: 'project' | 'guild' }>();
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>(ApplicationStatus.All);
  const [applicants, setApplicants] = useState<ISelectItem[]>([]);
  const [selectApplicant, setSelectApplicant] = useState<string>();
  const [selectAll, setSelectAll] = useState(false);

  const statusOption = useMemo(() => {
    return [
      { label: t('Project.AllState'), value: ApplicationStatus.All },
      { label: t('Project.ToBeReviewed'), value: ApplicationStatus.Open },
      { label: t('Project.Rejected'), value: ApplicationStatus.Rejected },
      { label: t('Project.ToBeIssued'), value: ApplicationStatus.Approved },
      { label: t('Project.Sending'), value: ApplicationStatus.Processing },
      { label: t('Project.Sended'), value: ApplicationStatus.Completed },
    ];
  }, [t]);

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  const changeDate = (rg: Date[]) => {
    setStartDate(rg[0]);
    setEndData(rg[1]);
    if ((rg[0] && rg[1]) || (!rg[0] && !rg[1])) {
      setSelectMap({});
      setPage(1);
    }
  };
  const onChangeCheckbox = (value: boolean, id: number) => {
    setSelectMap({ ...selectMap, [id]: value });
  };

  const getProjects = async () => {
    try {
      const res = await requests.project.getProjects({
        page: 1,
        size: 100,
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
        size: 100,
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
    getApplicants();
  }, []);

  useEffect(() => {
    getSources();
  }, []);

  const getRecords = async () => {
    setLoading(true);
    const queryData: IQueryParams = {};
    if (selectStatus) queryData.state = selectStatus;
    if (selectApplicant) queryData.applicant = selectApplicant;
    if (startDate && endDate) {
      queryData.start_date = formatDate(startDate);
      queryData.end_date = formatDate(endDate);
    }
    if (selectSource && selectSource.type) {
      queryData.entity_id = selectSource.id;
      queryData.entity = selectSource.type;
    }
    try {
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
      setList(
        res.data.rows.map((item) => ({
          ...item,
          created_date: formatTime(item.created_at),
        })),
      );
    } catch (error) {
      console.error('getProjectApplications failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const selectOrClearDate = (startDate && endDate) || (!startDate && !endDate);
    selectOrClearDate && getRecords();
  }, [selectStatus, selectApplicant, selectSource, page, pageSize, startDate, endDate]);

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
      await requests.application.approveApplications(select_ids);
      getRecords();
      // TODO alert success
      setSelectMap({});
    } catch (error) {
      console.error('handle approve failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const select_ids = getSelectIds();
      await requests.application.rejectApplications(select_ids);
      getRecords();
      setSelectMap({});
      // TODO alert success
    } catch (error) {
      console.error('handle reject failed', error);
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
    setSelectAll(v);
    const newMap = { ...selectMap };
    list.forEach((item) => {
      newMap[item.application_id] = v;
    });
    setSelectMap(newMap);
  };

  const canExport = useMemo(() => {
    const select_ids = getSelectIds();
    return select_ids.length > 0;
  }, [selectMap]);

  return (
    <Box>
      {loading && <Loading />}
      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">{t('Project.State')}</span>
            <Select
              className="sel"
              options={statusOption}
              placeholder=""
              onChange={(value) => {
                setSelectStatus(value?.value as ApplicationStatus);
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
          <li>
            <span className="tit">{t('Project.BudgetSource')}</span>
            <Select
              className="sel"
              options={allSource}
              placeholder=""
              onChange={(value) => {
                setSelectSource({ id: value?.value as number, type: value?.data });
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
          <li>
            <span className="tit">{t('Project.Operator')}</span>
            <Select
              className="sel"
              options={applicants}
              placeholder=""
              onChange={(value) => {
                setSelectApplicant(value?.value);
                setSelectMap({});
                setPage(1);
              }}
            />
          </li>
        </TopLine>
        <TimeLine>
          <TimeBox>
            <BorderBox>
              <RangeDatePickerStyle
                placeholder={t('Project.RangeTime')}
                onChange={changeDate}
                startDate={startDate}
                endDate={endDate}
              />
            </BorderBox>
          </TimeBox>
          <Button size="Medium" onClick={handleExport} disabled={!canExport}>
            {t('Project.Export')}
          </Button>
        </TimeLine>
      </FirstLine>
      <TopBox>
        <Button onClick={handleApprove}>{t('city-hall.Pass')}</Button>
        <Button appearance="outline" onClick={handleReject}>
          {t('city-hall.Reject')}
        </Button>
      </TopBox>
      <TableBox>
        {list.length ? (
          <>
            <table className="table" cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  {/* <th>
                  <Checkbox status="Primary" checked={selectAll} onChange={(value) => onSelectAll(value)}></Checkbox>
                </th> */}
                  <th>{t('Project.Time')}</th>
                  <th>{t('Project.Address')}</th>
                  <th>{t('Project.AddPoints')}</th>
                  <th>{t('Project.AddToken')}</th>
                  <th>{t('Project.Content')}</th>
                  <th>{t('Project.BudgetSource')}</th>
                  <th>{t('Project.Note')}</th>
                  <th>{t('Project.State')}</th>
                  <th>{t('Project.Operator')}</th>
                  <th>{t('Project.Auditor')}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.application_id}>
                    <td>
                      <Checkbox
                        status="Primary"
                        checked={selectMap[item.application_id]}
                        onChange={(value) => onChangeCheckbox(value, item.application_id)}
                      ></Checkbox>
                    </td>
                    <td>{item.created_date}</td>
                    <td>
                      <div>
                        <span>{publicJs.AddressToShow(item.target_user_wallet)}</span>
                        {/* <CopyBox text={item.target_user_wallet}>
                        <EvaIcon name="clipboard-outline" />
                      </CopyBox> */}
                      </div>
                    </td>
                    <td>{item.credit_amount}</td>
                    <td>{item.token_amount}</td>
                    <td>{item.detailed_type}</td>
                    <td>{item.budget_source}</td>
                    <td>{item.comment}</td>
                    <td>{item.status}</td>
                    <td>{item.submitter_name || item.submitter_wallet}</td>
                    <td>{item.reviewer_name || item.reviewer_wallet}</td>
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
    </Box>
  );
}
