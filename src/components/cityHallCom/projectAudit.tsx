import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import Select from '@paljs/ui/Select';
import React, { useState } from 'react';
import Page from 'components/pagination';
import DatePickerStyle from 'components/datePicker';
import { Checkbox } from '@paljs/ui/Checkbox';

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
  const onChangeCheckbox = (value: boolean, key: number) => {
    // setCheckbox({ ...checkbox, [key]: value });
  };
  return (
    <Box>
      <FirstLine>
        <TopLine>
          <li>
            <span className="tit">状态</span>
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
          <Button size="Medium">导出</Button>
        </TimeLine>
      </FirstLine>
      <TopBox>
        <Button>通过</Button>
        <Button appearance="outline">驳回</Button>
      </TopBox>
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
        {[...Array(20)].map((item, index) => (
          <tr key={index}>
            <td>
              <Checkbox status="Primary" checked={true} onChange={(value) => onChangeCheckbox(value, index)}></Checkbox>
            </td>
            <td>全球DAO场战略项目</td>
            <td>关闭项目</td>
            <td>--</td>
            <td>待审核</td>
            <td>WD</td>
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
    </Box>
  );
}
