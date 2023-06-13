import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import React from 'react';

const Box = styled.div``;
const TitBox = styled.div`
  font-weight: bold;
  margin: 40px 0 20px;
`;

const TopLine = styled.div``;

export default function AssetList() {
  return (
    <Box>
      <TitBox>记录</TitBox>
      <TopLine>dd</TopLine>
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
