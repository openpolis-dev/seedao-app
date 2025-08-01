import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Page from "../../../components/pagination";
import { getSeeList } from "../../../requests/see";
import useQuerySNS from "../../../hooks/useQuerySNS";
import useToast, { ToastType } from "../../../hooks/useToast";
import publicJs from "../../../utils/publicJs";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const Box = styled.div`
  width: 100%;
    margin-top: 10px;
    border-top: 1px solid var(--bs-border-color-focus);
    padding-top: 10px;
`

const TableBox = styled.div`
  width: 100%;
    td{
        height: auto!important;
        padding: 15px;
    }
`;

export default function Record(){
  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(1);
  const [list, setList] = useState([]);
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const { getMultiSNS } = useQuerySNS();

  useEffect(() => {
    getList();
  }, [pageCur]);

  const handleSNS = async (wallets: string[]) => {
    try{
      const sns_map = await getMultiSNS(wallets);
      setSnsMap(sns_map);
      console.log(sns_map);
    }catch(error:any){
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }

  };
  const getList= async() =>{
    const obj = {
      page: pageCur,
      size: pageSize,
    };

    const rt = await getSeeList(obj);
    console.log(rt);


    const { rows, page, size, total } = (rt as any).data;

    const _wallets = new Set<string>();
    rt.data.rows.forEach((r:any) => {
       _wallets.add(r.from_user?.toLowerCase());
      _wallets.add(r.to_user?.toLowerCase());
    });

    handleSNS(Array.from(_wallets));
    setList(rows);
    setPageSize(size);
    setTotal(total);
    setPageCur(page);
  }




  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };

  const fromSns =(wallet: string) => {
    const name = snsMap.get(wallet?.toLowerCase()) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };

  return <Box>
    <TableBox>
      <table className="table" cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
                <th>
                  {t('see.from')}
                </th>
              <th>    {t('see.to')}</th>
                <th>{t('see.comment')}</th>
                <th>{t('see.amount')}</th>
                <th>{t('see.time')}</th>
            </tr>
          </thead>
        <tbody>
        {
          list.map((item:any,index) => ( <tr key={index}>
            <td>{fromSns(item.from_user)}</td>
            <td>{fromSns(item.to_user)}</td>
            <td>{item.comment}</td>
            <td>{item.amount}</td>
            <td>{dayjs(item.transaction_ts * 1000).format(`YYYY-MM-DD HH:mm:ss`)}</td>
          </tr>))
        }

        </tbody>
      </table>

      <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
    </TableBox>
  </Box>
}
