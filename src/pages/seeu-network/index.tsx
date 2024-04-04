import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { EventCard } from 'seeucomp';
import { getSeeuEventList } from 'requests/event';
import Page from 'components/pagination';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { Row, Col } from 'react-bootstrap';
import { ContainerPadding } from '../../assets/styles/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Tabbar from 'components/common/tabbar';
import BackerNav from '../../components/common/backNav';

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

const TopBox = styled.div`
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
`;

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
      {/*<TitBox>*/}
      {/*  <div className="titLft">*/}
      {/*    <Tabbar defaultActiveKey={0} tabs={[{ key: 0, title: t('event.events') }]} />*/}
      {/*  </div>*/}
      {/*</TitBox>*/}
      <TopBox>
        <BackerNav title={t('apps.Event')} to={`/apps`} mb="20px" />
      </TopBox>

      <Row>
        {lst.map((item, idx) => (
          <Col key={idx} sm={12} md={6} lg={3} xl={3} style={{ marginBottom: '30px' }}>
            <Link to={`/event/view?id=${item.id}`}>
              <EventCard item={item} />
            </Link>
          </Col>
        ))}
      </Row>
      {total > pageSize && (
        <PageBox>
          <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
        </PageBox>
      )}
    </OuterBox>
  );
}

const PageBox = styled.div`
  margin: 0 40px;
`;

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
  .itemBox {
    background-color: var(--bs-box-background);
    border: 1px solid var(--bs-border-color);
  }
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
