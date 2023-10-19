import { useEffect, useState } from 'react';
import styled from 'styled-components';
import EventList from 'seeucomp/src';
import { getSeeuEventList } from 'requests/event';
import Page from 'components/pagination';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';

interface IEventProps {
  startTime: string;
  thumbnail: string | undefined;
  poster: string;
  subject: string;
  start_time: string;
  city: {
    name: string;
    latitude: string;
    longitude: string;
  };
  url: string;
  status: string;
  tags?: string[];
  id: number;
}

export default function SeeuNetwork() {
  const [lst, setLst] = useState<IEventProps[]>([]);
  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(1);
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };

  const getList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await getSeeuEventList({ pageSize, currentPage: pageCur });
      console.log('resp: ', resp);
      setTotal(resp.data.total);
      setLst(resp.data.data);
    } catch (error: any) {
      showToast(error, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
    }
  };

  useEffect(() => {
    getList();
  }, [pageCur, pageSize]);
  return (
    <div>
      {/* @ts-ignore */}
      {lst.length > 0 && <EventList listData={lst} />}
      {total > pageSize && (
        <PageBox>
          <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
        </PageBox>
      )}
    </div>
  );
}

const PageBox = styled.div`
  margin: 0 40px;
`;
