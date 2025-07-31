import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Page from "../../../components/pagination";
import { getSeeList } from "../../../requests/see";

const Box = styled.div`
  width: 100%;
    margin-top: 10px;
    border-top: 1px solid var(--bs-border-color-focus);
    padding-top: 10px;
`

const TableBox = styled.div`
  width: 100%;
  overflow-y: auto;
    
    height: 50vh;
`;

export default function Record(){
  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(1);
  const [list, setList] = useState([]);



  useEffect(() => {
    getList();
  }, [pageCur]);


  const getList= async() =>{
    const obj = {
      page: pageCur,
      size: pageSize,
    };

    const rt = await getSeeList(obj);

    const { rows, page, size, total } = (rt as any).data;
    setList(rows);
    setPageSize(size);
    setTotal(total);
    setPageCur(page);
  }




  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };

  return <Box>
    <TableBox>
      <table className="table" cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
                <th></th>
            </tr>
          </thead>
      </table>

      <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
    </TableBox>
  </Box>
}
