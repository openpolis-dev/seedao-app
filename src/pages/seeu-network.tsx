import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { EventCard } from 'seeucomp';
import { getSeeuEventList } from 'requests/event';
import Page from 'components/pagination';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { ContainerPadding } from '../assets/styles/global';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  useEffect(() => {
    getList();
  }, [pageCur, pageSize]);
  return (
    <OuterBox>
      <InnerBox>
        <TitBox>
          <div className="titLft">
            <Tabs defaultActiveKey={0}>
              <Tab title={t('event.events')} eventKey={0} />
            </Tabs>
          </div>
        </TitBox>
        <Row>
          {lst.map((item, idx) => (
            <Col
              key={idx}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              onClick={() => window.open(`https://seeu.network/event/${item.id}`, '_blank')}
              style={{ marginBottom: '30px' }}
            >
              <EventCard item={item} />
            </Col>
          ))}
        </Row>
        {total > pageSize && (
          <PageBox>
            <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
          </PageBox>
        )}
      </InnerBox>
    </OuterBox>
  );
}

const PageBox = styled.div`
  margin: 0 40px;
`;

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const InnerBox = styled.div`
  background: #fff;
  padding: 20px;
  min-height: 100%;
  .item-content {
    h5,
    h6 {
      font-size: 16px;
    }
    .status {
      font-size: 12px;
    }
  }
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .titLft {
    width: 100%;
  }
`;
