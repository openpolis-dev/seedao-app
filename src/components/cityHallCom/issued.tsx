import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import Select from '@paljs/ui/Select';
import React, { useState, useEffect, useMemo } from 'react';
import Page from 'components/pagination';
import RangeDatePickerStyle from 'components/rangeDatePicker';
import { Checkbox } from '@paljs/ui/Checkbox';
import IssuedModal from 'components/cityHallCom/issuedModal';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import Loading from 'components/loading';
import requests from 'requests';
import { formatDate, formatTime } from 'utils/time';
import publicJs from 'utils/publicJs';
import NoItem from 'components/noItem';
import { IQueryApplicationsParams } from 'requests/applications';
import CopyBox from 'components/copy';
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

export default function Issued() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndData] = useState<Date>();
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectMap, setSelectMap] = useState<{ [id: number]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>();
  const [isProcessing, setIsProcessing] = useState(false);

  const statusOption = useMemo(() => {
    return [
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
  const handleShow = () => {
    setShow(true);
  };
  const closeShow = () => {
    setShow(false);
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

  const getRecords = async () => {
    setLoading(true);
    try {
      const queryData: IQueryApplicationsParams = {};
      if (selectStatus) queryData.state = selectStatus;
      if (startDate && endDate) {
        queryData.start_date = formatDate(startDate);
        queryData.end_date = formatDate(endDate);
      }
      const res = await requests.application.getProjectApplications(
        {
          page,
          size: pageSize,
          sort_field: 'created_at',
          sort_order: 'desc',
        },
        queryData,
        undefined,
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
  }, [selectStatus, page, pageSize, startDate, endDate]);

  const handleComplete = async (data: string[]) => {
    setLoading(true);
    try {
      await requests.application.compeleteApplications(data);
      closeShow();
      getRecords();
      setIsProcessing(false);
      // TODO alert
    } catch (error) {
      console.error('compeleteApplications failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    const ids = Object.keys(selectMap);
    const select_ids: number[] = [];
    for (const id of ids) {
      const _id = Number(id);
      if (selectMap[_id]) {
        select_ids.push(_id);
      }
    }
    if (!select_ids.length) {
      return;
    }
    setLoading(true);
    try {
      await requests.application.processApplications(select_ids);
      getRecords();
      setSelectMap({});
      setIsProcessing(true);
      // TODO alert
    } catch (error) {
      console.error('processApplications failed', error);
    } finally {
      setLoading(false);
    }
  };

  const showProcessButton = () => {
    if (isProcessing) {
      return (
        <TopBox>
          <Button onClick={() => handleShow()}>{t('city-hall.SendCompleted')}</Button>
        </TopBox>
      );
    } else if (selectStatus === ApplicationStatus.Approved) {
      return (
        <TopBox>
          <Button onClick={handleProcess}>{t('city-hall.Send')}</Button>
        </TopBox>
      );
    }
  };

  const handleStatus = async () => {
    const res = await requests.application.getProjectApplications(
      {
        page: 1,
        size: 1,
        sort_field: 'created_at',
        sort_order: 'desc',
      },
      {
        state: ApplicationStatus.Processing,
      },
    );
    if (!!res.data.rows.length) {
      setIsProcessing(true);
    }
  };

  useEffect(() => {
    handleStatus();
  }, []);

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

  const canExport = useMemo(() => {
    const select_ids = getSelectIds();
    return select_ids.length > 0;
  }, [selectMap]);

  return (
    <Box>
      {loading && <Loading />}
      {show && <IssuedModal closeShow={closeShow} handleConfirm={handleComplete} />}

      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">{t('Project.State')}</span>
            <Select
              className="sel"
              options={statusOption}
              placeholder=""
              onChange={(value) => {
                setSelectStatus(value?.value);
                setSelectMap({});
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
      {showProcessButton()}
      <TableBox>
        {list.length ? (
          <>
            <table className="table" cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  <th>&nbsp;</th>
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
                {list.map((item, index) => (
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
                        <>复制</>
                      </CopyBox> */}
                      </div>
                    </td>
                    <td>{item.credit_amount}</td>
                    <td>{item.token_amount}</td>
                    <td>{item.detailed_type}</td>
                    <td>{item.budget_source}</td>
                    <td>{item.comment}</td>
                    <td>{item.status}</td>
                    <td>{item.submitter_name || publicJs.AddressToShow(item.submitter_wallet)}</td>
                    <td>{item.reviewer_name || publicJs.AddressToShow(item.reviewer_wallet)}</td>
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
