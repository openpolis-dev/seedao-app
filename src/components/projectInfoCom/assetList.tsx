import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import Select from '@paljs/ui/Select';
import React, { useEffect, useState } from 'react';
import Page from 'components/pagination';
import ViewHash from './viewHash';
import RangeDatePickerStyle from 'components/rangeDatePicker';
import { Checkbox } from '@paljs/ui/Checkbox';
import requests from 'requests';
import { IQueryApplicationsParams } from 'requests/applications';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import utils from 'utils/publicJs';
import NoItem from 'components/noItem';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import Loading from 'components/loading';
import { formatDate, formatTime } from 'utils/time';

const Box = styled.div``;
const TitBox = styled.div`
  font-weight: bold;
  margin: 40px 0 20px;
`;
const FirstLine = styled.div`
  display: flex;
  //flex-direction: column;
  margin-bottom: 20px;
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

export default function AssetList({ id }: { id: number }) {
  const {
    state: { loading },
    dispatch,
  } = useAuthContext();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndData] = useState<Date>();
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>();
  const [selectMap, setSelectMap] = useState<{ [id: number]: boolean }>({});
  const [applicants, setApplicants] = useState<ISelectItem[]>([]);
  const [selectApplicant, setSelectApplicant] = useState<string>();

  const statusOption: ISelectItem[] = [
    { label: '待审核', value: ApplicationStatus.Open },
    { label: '被驳回', value: ApplicationStatus.Rejected },
    { label: '已通过', value: ApplicationStatus.Approved },
    { label: '待发放', value: ApplicationStatus.Processing },
    { label: '已发放', value: ApplicationStatus.Completed },
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
  };
  const onChangeCheckbox = (value: boolean, id: number) => {
    setSelectMap({ ...selectMap, [id]: value });
  };

  const getApplicants = async () => {
    try {
      const res = await requests.application.getApplicants({
        entity: 'project',
        entity_id: id,
      });
      const options = res.data.map((item) => ({
        label: item.name || utils.AddressToShow(item.applicant),
        value: item.applicant,
      }));
      setApplicants(options);
    } catch (error) {
      console.error('getApplicants error', error);
    }
  };

  useEffect(() => {
    id && getApplicants();
  }, [id]);

  const getRecords = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const queryData: IQueryApplicationsParams = {};
      if (selectStatus) queryData.state = selectStatus;
      if (selectApplicant) queryData.applicant = selectApplicant;
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
        id,
      );
      setTotal(res.data.total);
      const _list = res.data.rows.map((item) => ({
        ...item,
        created_date: formatTime(item.created_at),
      }));
      setList(_list);
    } catch (error) {
      console.error('getRecords error', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    const selectOrClearDate = (startDate && endDate) || (!startDate && !endDate);
    id && selectOrClearDate && getRecords();
  }, [id, selectStatus, selectApplicant, page, pageSize, startDate, endDate]);
  return (
    <Box>
      {show && <ViewHash closeShow={closeShow} />}
      {loading && <Loading />}

      <TitBox>记录</TitBox>
      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">状态</span>
            <Select
              className="sel"
              options={statusOption}
              placeholder="Status"
              onChange={(value) => setSelectStatus(value?.value)}
            />
          </li>
          <li>
            <span className="tit">操作人</span>
            <Select
              className="sel"
              options={applicants}
              placeholder="applicant"
              onChange={(value) => setSelectApplicant(value?.value)}
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
      {list.length ? (
        <>
          <table className="table" cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>时间</th>
                <th>钱包地址</th>
                <th>登记积分</th>
                <th>登记Token</th>
                <th>事项内容</th>
                <th>备注</th>
                <th>状态</th>
                <th>登记人</th>
                <th>审核人</th>
                <th>交易ID</th>
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
                  <td>{item.target_user_wallet}</td>
                  <td>{item.creadit_amount}</td>
                  <td>{item.token_amount}</td>
                  <td></td>
                  <td>--</td>
                  <td>{item.status}</td>
                  <td>{item.submitter_name || item.submitter_wallet}</td>
                  <td>{item.reviewer_name || item.reviewer_wallet}</td>
                  <td>
                    {item.status === ApplicationStatus.Completed && (
                      <Button appearance="outline" size="Tiny" onClick={() => handleShow(0)}>
                        查看
                      </Button>
                    )}
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
    </Box>
  );
}
