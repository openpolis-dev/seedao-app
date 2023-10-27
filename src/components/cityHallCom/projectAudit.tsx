import styled from 'styled-components';
import { Button, Form } from 'react-bootstrap';
// import Select from '@paljs/ui/Select';
import React, { useState, useEffect, useMemo } from 'react';
import Page from 'components/pagination';
import RangeDatePickerStyle from 'components/rangeDatePicker';
// import { Checkbox } from '@paljs/ui/Checkbox';
import requests from 'requests';
import Loading from 'components/loading';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import { formatDate, formatTime } from 'utils/time';
import { IQueryApplicationsParams } from 'requests/applications';
import publicJs from 'utils/publicJs';
import NoItem from 'components/noItem';
import { useTranslation } from 'react-i18next';
import { formatApplicationStatus } from 'utils/index';
import useToast, { ToastType } from 'hooks/useToast';
import Select from 'components/common/select';
import { useNavigate } from 'react-router-dom';
import ApplicationStatusTag from 'components/common/applicationStatusTag';

const Box = styled.div``;
const FirstLine = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
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
  }
`;

const TimeBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const BorderBox = styled.div`
  border: 1px solid #eee;
  padding: 2px 20px;
  border-radius: 5px;
  background: #f7f9fc;
`;

const TopBox = styled.div`
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

const SectionTitle = styled.div`
  font-size: 24px;
  margin-block: 24px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: var(--bs-body-color_active);
`;

export default function ProjectAudit() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndData] = useState<Date>();
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>();
  const [selectMap, setSelectMap] = useState<{ [id: number]: ApplicationStatus | boolean }>({});

  const statusOption = useMemo(() => {
    return [
      { label: t(formatApplicationStatus(ApplicationStatus.Open, true)), value: ApplicationStatus.Open },
      { label: t(formatApplicationStatus(ApplicationStatus.Rejected, true)), value: ApplicationStatus.Rejected },
      { label: t(formatApplicationStatus(ApplicationStatus.Approved, true)), value: ApplicationStatus.Approved },
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
  const onChangeCheckbox = (value: boolean, id: number, status: ApplicationStatus) => {
    setSelectMap({ ...selectMap, [id]: value && status });
  };

  const getRecords = async () => {
    setLoading(true);
    try {
      const queryData: IQueryApplicationsParams = {};
      if (selectStatus) queryData.state = selectStatus;
      if (startDate && endDate) {
        queryData.start_date = formatDate(startDate);
        queryData.end_date = formatDate(endDate);
      }
      const res = await requests.application.getCloseProjectApplications(
        {
          page,
          size: pageSize,
          sort_field: 'created_at',
          sort_order: 'desc',
        },
        queryData,
      );
      setTotal(res.data.total);
      const _list = res.data.rows.map((item) => ({
        ...item,
        created_date: formatTime(item.created_at),
      }));
      setList(_list);
    } catch (error) {
      console.error('getCloseProjectApplications failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const selectOrClearDate = (startDate && endDate) || (!startDate && !endDate);
    selectOrClearDate && getRecords();
  }, [selectStatus, page, pageSize, startDate, endDate]);

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
      setSelectMap({});
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
      getRecords();
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
      await requests.application.rejectApplications(select_ids);
      setSelectMap({});
      showToast(t('Msg.ApproveSuccess'), ToastType.Success);
      getRecords();
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

  const openCreate = (val: string) => {
    if (val === 'project') navigate('/create-project');
    if (val === 'guild') navigate('/create-guild');
  };

  return (
    <Box>
      {loading && <Loading />}
      <section>
        <SectionTitle>{t('city-hall.create')}</SectionTitle>
        <TopBox>
          <CreateCard onClick={() => openCreate('project')}>{t('Project.create')}</CreateCard>
          <CreateCard onClick={() => openCreate('guild')}>{t('Guild.create')}</CreateCard>
        </TopBox>
      </section>
      <section>
        <SectionTitle>{t('city-hall.closeProjectReview')}</SectionTitle>
        <FirstLine>
          <TopLine>
            <li>
              <span className="tit">{t('Project.State')}</span>
              <Select
                options={statusOption}
                placeholder=""
                onChange={(value: any) => {
                  setSelectStatus(value?.value);
                  setSelectMap({});
                }}
              />
            </li>
            <li>
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
              <Button onClick={handleExport} disabled={!selectOne}>
                {t('Project.Export')}
              </Button>
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
        </FirstLine>

        <TableBox>
          {list.length ? (
            <>
              <table className="table" cellPadding="0" cellSpacing="0">
                <thead>
                  <tr>
                    <th>
                      <Form.Check checked={ifSelectAll} onChange={(e) => onSelectAll(e.target.checked)}></Form.Check>
                    </th>
                    <th>{t('Project.Time')}</th>
                    <th>{t('city-hall.ProjectName')}</th>
                    <th>{t('city-hall.Content')}</th>
                    <th>{t('Project.Note')}</th>
                    <th>{t('Project.State')}</th>
                    <th>{t('city-hall.Applicant')}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Check
                          checked={!!selectMap[item.application_id]}
                          onChange={(e) => onChangeCheckbox(e.target.checked, item.application_id, item.status)}
                        ></Form.Check>
                      </td>
                      <td>{item.created_date}</td>
                      <td>{item.budget_source}</td>
                      <td>{t('city-hall.CloseProject')}</td>
                      <td>{item.comment}</td>
                      <td>
                        <ApplicationStatusTag status={item.status} isProj={true} />
                      </td>
                      <td>{item.submitter_name || publicJs.AddressToShow(item.submitter_wallet)}</td>
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
      </section>
    </Box>
  );
}

const CreateCard = styled.div`
  width: 190px;
  background: var(--bs-box--background);
  border-radius: 16px;
  opacity: 1;
  padding-block: 21px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-family: Poppins-Medium, Poppins;
  color: var(--bs-body-color_active);
  cursor: pointer;
  margin-right: 24px;
  &:hover {
    background: var(--bs-menu-hover);
  }
`;
