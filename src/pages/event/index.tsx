import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import { Card } from '@paljs/ui/Card';
import styled from 'styled-components';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import { ButtonLink } from '@paljs/ui/Button';
import { useRouter } from 'next/router';
import { getEventList, getMyEvent } from 'requests/event';
import Page from 'components/pagination';
import { Tab, Tabs } from '@paljs/ui/Tabs';
import { AppActionType, useAuthContext } from 'providers/authProvider';

const Box = styled.div`
  padding: 40px 0;
  a:hover {
    color: #fff;
    opacity: 0.8;
  }
`;

const ActiveBox = styled.div`
  margin: 0 2rem;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 100%;
  }
  .title {
    font-size: 1rem;
    line-height: 1.5em;
    height: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin: 1rem;
  }
`;

const CardBox = styled.div`
  border: 1px solid #f1f1f1;
  margin-bottom: 40px;
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
`;
const ImageBox = styled.div`
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  width: 100%;

  img {
    width: 100%;
  }
`;
const Photo = styled.div`
  display: flex !important;
  overflow: hidden;
  .aspect {
    padding-bottom: 100%;
    height: 0;
    flex-grow: 1 !important;
  }
  .content {
    width: 100%;
    margin-left: -100% !important;
    max-width: 100% !important;
    flex-grow: 1 !important;
    position: relative;
  }
  .innerImg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
    img {
      width: 100%;
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

const RhtBox = styled.div``;

const LineBox = styled.div`
  background: url('/images/homebg.png') center no-repeat;
  background-size: 100%;
  background-attachment: fixed;
  margin-bottom: 80px;
  .inner {
    background: rgba(161, 110, 255, 0.7);
    padding: 2.2rem;
  }
  ul {
    display: flex;
    align-items: center;
    width: 100%;
  }
  li {
    width: 33.33333%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .num {
    font-size: 3rem;
    font-weight: bold;
    margin-right: 1.5rem;
    font-family: 'Jost-Bold';
  }
`;

const PageBox = styled.div`
  margin: 0 40px;
`;

const RhtBoxT = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;
export default function Index() {
  const router = useRouter();

  const { dispatch } = useAuthContext();
  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(1);
  const [current, setCurrent] = useState<number>(0);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!current) {
      getList();
    } else {
      getMyList();
    }
  }, [pageCur, current]);

  const getList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const rt = await getEventList({
      page: pageCur,
      size: pageSize,
      sort_order: 'desc',
      sort_field: 'start_at',
      state: '',
    });
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    const { rows, total, size, page } = rt.data;
    setList(rows);
    setPageCur(page);
    setPageSize(size);
    setTotal(total);
    // setList(rt.data)
  };

  const getMyList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const rt = await getMyEvent({
      page: pageCur,
      size: pageSize,
      sort_order: 'desc',
      sort_field: 'start_at',
      state: '',
    });
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    const { rows, total, size, page } = rt.data;
    setList(rows);
    setPageCur(page);
    setPageSize(size);
    setTotal(total);
  };

  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };

  const selectCurrent = (e: number) => {
    setCurrent(e);
    setPageCur(1);
  };

  return (
    <Layout title="SeeDAO Project">
      <Card>
        <Box>
          <ActiveBox>
            <TitBox>
              <div className="titLft">
                <Tabs activeIndex={0} onSelect={(e) => selectCurrent(e)}>
                  <Tab title="Events" responsive />
                  <Tab title="My Events" responsive />
                </Tabs>
              </div>

              {/*<span>Events</span>*/}
              <RhtBoxT>
                <ButtonLink onClick={() => router.push('/event/info')} fullWidth shape="Rectangle">
                  Create Event
                </ButtonLink>
              </RhtBoxT>
            </TitBox>
            <Row>
              {list?.map((item, idx) => (
                <Col
                  breakPoint={{ xs: 3, sm: 3, md: 3, lg: 2.4 }}
                  key={idx}
                  onClick={() => router.push(`event/info?id=${item.id}`)}
                >
                  <CardBox>
                    <Item>
                      <ImageBox>
                        <Photo>
                          <div className="aspect" />
                          <div className="content">
                            <div className="innerImg">
                              <img src={item.cover_img} alt="" />
                            </div>
                          </div>
                        </Photo>
                      </ImageBox>
                      <div className="title">{item.title}</div>
                    </Item>
                  </CardBox>
                </Col>
              ))}
            </Row>
          </ActiveBox>
          {total > pageSize && (
            <PageBox>
              <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
            </PageBox>
          )}
        </Box>
      </Card>
    </Layout>
  );
}
