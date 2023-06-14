import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import Select from '@paljs/ui/Select';
import React, { useState } from 'react';
import Page from 'components/pagination';
import ViewHash from './viewHash';
import DatePickerStyle from 'components/datePicker';

const Box = styled.div``;
const TitBox = styled.div`
  font-weight: bold;
  margin: 40px 0 20px;
`;
const FirstLine = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  //align-items: center;
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
`;

const TimeBox = styled.div`
  display: flex;
  align-items: center;
`;

const BorderBox = styled.div`
  border: 1px solid #eee;
  padding: 10px 20px;
  border-radius: 5px;
`;

const MidBox = styled.div`
  margin: 0 20px;
`;

export default function AssetList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);
  const [show, setShow] = useState(false);
  const [dateTime, setDateTime] = useState<Date | null>(null);

  const statusOption: { value: any; label: any }[] = [
    { label: '待审核', value: '待审核' },
    { value: '被驳回', label: '被驳回' },
    { value: '待发放', label: '待发放' },
    { value: '已发放', label: '已发放' },
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

  const changeDate = (time: Date) => {
    console.log(time?.getTime());
    const str = new Date(time?.getTime());
    setDateTime(str);
  };
  return (
    <Box>
      {show && <ViewHash closeShow={closeShow} />}

      <TitBox>记录</TitBox>
      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">状态</span>
            <Select className="sel" options={statusOption} placeholder="Status" />
          </li>
          <li>
            <span className="tit">治理公会</span>
            <Select className="sel" options={statusOption} placeholder="Status" />
          </li>
          <li>
            <span className="tit">操作人</span>
            <Select className="sel" options={statusOption} placeholder="Status" />
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
          <Button size="Small">导出</Button>
        </TimeLine>
      </FirstLine>

      <table className="table" cellPadding="0" cellSpacing="0">
        <tr>
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
        <tr>
          <td>2023/06/13</td>
          <td>0Xfds...sdf</td>
          <td>d</td>
          <td>100USD</td>
          <td>酬劳</td>
          <td>--</td>
          <td>待审核</td>
          <td>WD</td>
          <td>WD</td>
          <td>
            <Button appearance="outline" size="Tiny" onClick={() => handleShow(0)}>
              查看
            </Button>
          </td>
        </tr>
        <tr>
          <td>2023/06/13</td>
          <td>0Xfds...sdf</td>
          <td>d</td>
          <td>100USD</td>
          <td>酬劳</td>
          <td>--</td>
          <td>待审核</td>
          <td>WD</td>
          <td>WD</td>
          <td>
            <Button appearance="outline" size="Tiny" onClick={() => handleShow(0)}>
              查看
            </Button>
          </td>
        </tr>
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
