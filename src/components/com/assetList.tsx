import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import Select from '@paljs/ui/Select';
import React from 'react';

const Box = styled.div``;
const TitBox = styled.div`
  font-weight: bold;
  margin: 40px 0 20px;
`;
const FirstLine = styled.div`
  display: flex;
  align-items: center;
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

    .sel {
      min-width: 150px;
    }
  }
`;

export default function AssetList() {
  const statusOption: { value: any; label: any }[] = [
    { label: 'Clean', value: '' },
    { value: 'Info', label: 'Info' },
    { value: 'Success', label: 'Success' },
    { value: 'Danger', label: 'Danger' },
    { value: 'Primary', label: 'Primary' },
  ];
  return (
    <Box>
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
        <div>dd</div>
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
            <Button appearance="outline" size="Tiny">
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
            <Button appearance="outline" size="Tiny">
              查看
            </Button>
          </td>
        </tr>
      </table>
    </Box>
  );
}
