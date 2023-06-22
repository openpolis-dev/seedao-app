import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import Select from '@paljs/ui/Select';
import React, { useState, useEffect } from 'react';
import Page from 'components/pagination';
import RangeDatePickerStyle from 'components/rangeDatePicker';
import { Checkbox } from '@paljs/ui/Checkbox';
import requests from 'requests';
import Loading from 'components/loading';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import { formatDate, formatTime } from 'utils/time';
import { IQueryApplicationsParams } from 'requests/applications';
import publicJs from 'utils/publicJs';
import NoItem from 'components/noItem';

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

export default function ProjectAudit() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndData] = useState<Date>();
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>();
  const [selectMap, setSelectMap] = useState<{ [id: number]: boolean }>({});

  const statusOption: { value: any; label: any }[] = [
    { label: '待审核', value: ApplicationStatus.Open },
    { label: '被驳回', value: ApplicationStatus.Rejected },
    { label: '已通过', value: ApplicationStatus.Completed },
  ];

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };
  const handleShow = (num: number) => {
    setShow(true);
    console.log(num);
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

  const handleApprove = async () => {
    setLoading(true);
    try {
      const ids = Object.keys(selectMap);
      const select_ids: number[] = [];
      for (const id of ids) {
        const _id = Number(id);
        if (selectMap[_id]) {
          select_ids.push(_id);
        }
      }
      await requests.application.approveApplications(select_ids);
      setSelectMap({});
      getRecords();
    } catch (error) {
      console.error('handle approve failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const ids = Object.keys(selectMap);
      const select_ids: number[] = [];
      for (const id of ids) {
        const _id = Number(id);
        if (selectMap[_id]) {
          select_ids.push(_id);
        }
      }
      await requests.application.rejectApplications(select_ids);
      setSelectMap({});
      getRecords();
    } catch (error) {
      console.error('handle reject failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading && <Loading />}
      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">状态</span>
            <Select
              className="sel"
              options={statusOption}
              placeholder="Status"
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
                placeholder="开始时间-结束时间"
                onChange={changeDate}
                startDate={startDate}
                endDate={endDate}
              />
            </BorderBox>
          </TimeBox>
          <Button size="Medium">导出</Button>
        </TimeLine>
      </FirstLine>
      <TopBox>
        <Button onClick={handleApprove}>通过</Button>
        <Button appearance="outline" onClick={handleReject}>
          驳回
        </Button>
      </TopBox>
      {list.length ? (
        <>
          <table className="table" cellPadding="0" cellSpacing="0">
            <tr>
              <th>&nbsp;</th>
              <th>时间</th>
              <th>项目</th>
              <th>申请内容</th>
              <th>备注</th>
              <th>状态</th>
              <th>申请人</th>
            </tr>
            {list.map((item, index) => (
              <tr key={index}>
                <td>
                  <Checkbox
                    status="Primary"
                    checked={selectMap[item.application_id]}
                    onChange={(value) => onChangeCheckbox(value, item.application_id)}
                  ></Checkbox>
                </td>
                <td>{item.created_date}</td>
                <td>{item.budget_source}</td>
                <td>关闭项目</td>
                <td>--</td>
                <td>{item.status}</td>
                <td>{item.submitter_name || publicJs.AddressToShow(item.submitter_wallet)}</td>
              </tr>
            ))}
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
    </Box>
  );
}
