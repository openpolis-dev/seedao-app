import styled from 'styled-components';
import React, { useState } from 'react';
import Page from 'components/pagination';
import { EvaIcon } from '@paljs/ui/Icon';

const Box = styled.div``;

export default function RegList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  return (
    <Box>
      <table className="table" cellPadding="0" cellSpacing="0">
        <tr>
          <th>钱包地址</th>
          <th>登记积分</th>
          <th>登记Token</th>
          <th>事项内容</th>
          <th>备注</th>
        </tr>
        <tr>
          <td>0Xfds...sdf</td>
          <td>d</td>
          <td>100USD</td>
          <td>酬劳</td>
          <td>--</td>
        </tr>
        <tr>
          <td>0Xfds...sdf</td>
          <td>d</td>
          <td>100USD</td>
          <td>酬劳</td>
          <td>--</td>
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
