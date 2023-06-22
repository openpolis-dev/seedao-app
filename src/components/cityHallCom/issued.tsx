import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import Select from '@paljs/ui/Select';
import React, { useState, useEffect } from 'react';
import Page from 'components/pagination';
import DatePickerStyle from 'components/datePicker';
import { Checkbox } from '@paljs/ui/Checkbox';
import IssuedModal from 'components/cityHallCom/issuedModal';
import { IApplicationDisplay, ApplicationStatus } from 'type/application.type';
import Loading from 'components/loading';
import requests from 'requests';

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

export default function Issued() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [list, setList] = useState<IApplicationDisplay[]>([]);
  const [selectMap, setSelectMap] = useState<{ [id: number]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [selectStatus, setSelectStatus] = useState<ApplicationStatus>();

  const statusOption: ISelectItem[] = [
    { label: '已通过', value: ApplicationStatus.Approved },
    { label: '待发放', value: ApplicationStatus.Processing },
  ];

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

  const changeDate = (time: Date) => {
    console.log(time?.getTime());
    const str = new Date(time?.getTime());
    setDateTime(str);
  };
  const onChangeCheckbox = (value: boolean, id: number) => {
    setSelectMap({ ...selectMap, [id]: value });
  };

  const getRecords = async () => {
    setLoading(true);
    try {
      const res = await requests.application.getProjectApplications(
        {
          page,
          size: pageSize,
          sort_field: 'created_at',
          sort_order: 'desc',
        },
        {},
        undefined,
      );
      setTotal(res.data.total);
      setList(
        res.data.rows.map((item) => ({
          ...item,
          created_date: '',
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
  }, [selectStatus, page, pageSize]);

  return (
    <Box>
      {loading && <Loading />}
      {show && <IssuedModal closeShow={closeShow} />}

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
        </TopLine>
        <TimeLine>
          <TimeBox>
            <BorderBox>
              <DatePickerStyle placeholder="开始时间" onChange={changeDate} dateTime={dateTime} />
            </BorderBox>
            <MidBox>~</MidBox>
            <BorderBox>
              <DatePickerStyle placeholder="开始时间" onChange={changeDate} dateTime={dateTime} />
            </BorderBox>
          </TimeBox>
          <Button size="Medium">导出</Button>
        </TimeLine>
      </FirstLine>
      <TopBox>
        <Button onClick={() => handleShow()}>发放完成</Button>
      </TopBox>
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
          </tr>
        </thead>

        <tbody>
          {list.map((item, index) => (
            <tr key={item.application_id}>
              <td>
                <Checkbox
                  status="Primary"
                  checked={false}
                  onChange={(value) => onChangeCheckbox(value, item.application_id)}
                ></Checkbox>
              </td>
              <td>{item.created_date}</td>
              <td>{item.target_user_wallet}</td>
              <td>{item.creadit_amount}</td>
              <td>{item.token_amount}</td>
              <td>{item.budget_source}</td>
              <td>--</td>
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
    </Box>
  );
}
