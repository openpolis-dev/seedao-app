import React, { useEffect, useState } from 'react';
// import { Card } from '@paljs/ui/Card';
import styled from 'styled-components';
import { Row, Col, Tab, Tabs, Button } from 'react-bootstrap';
// import { ButtonLink } from '@paljs/ui/Button';
import { getEventList, getMyEvent } from 'requests/event';
import Page from 'components/pagination';
// import { Tab, Tabs } from '@paljs/ui/Tabs';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useTranslation } from 'react-i18next';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import { filter } from 'minimatch';
import useToast, { ToastType } from 'hooks/useToast';
import { useWeb3React } from '@web3-react/core';
import { useNavigate } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';

const BoxOuter = styled.div`
  height: 100%;
  ${ContainerPadding};
`;

const Box = styled.div`
  box-sizing: border-box;
  a:hover {
    color: #fff;
    opacity: 0.8;
  }
`;

const Card = styled.div`
  background: #fff;
  box-shadow: rgba(44, 51, 73, 0.1) 0px 0.5rem 1rem 0px;
  min-height: 100%;
  padding-top: 10px;
  box-sizing: border-box;
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
    font-weight: bold;
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
      height: 100%;
      object-fit: cover;
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

const PageBox = styled.div`
  margin: 0 40px;
`;

const RhtBoxT = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;
export default function Index() {
  // const router = useRouter();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const { dispatch } = useAuthContext();
  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(1);
  const [current, setCurrent] = useState<number>(0);
  const [list, setList] = useState<any[]>([]);

  const canCreateEvent = usePermission(PermissionAction.ActCreateEvent, PermissionObject.ObjEvent);

  useEffect(() => {
    if (!current) {
      getList();
    } else {
      getMyList();
    }
  }, [pageCur, current]);

  const getList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const rt = await getEventList({
        page: pageCur,
        size: pageSize,
        sort_order: 'desc',
        sort_field: 'start_at',
      });

      const { rows, total, size, page } = rt.data;
      setList(rows);
      setPageCur(page);
      setPageSize(size);
      setTotal(total);
    } catch (e: any) {
      showToast(e.message, ToastType.Danger);
      console.error('event list', e);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }

    // setList(rt.data)
  };

  const getMyList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const rt = await getMyEvent({
        page: pageCur,
        size: pageSize,
        sort_order: 'desc',
        sort_field: 'start_at',
        state: '',
      });
      const { rows, total, size, page } = rt.data;
      setList(rows);
      setPageCur(page);
      setPageSize(size);
      setTotal(total);
    } catch (e: any) {
      console.error('my event list', e);
      showToast(e.message, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };

  const selectCurrent = (e: any) => {
    setCurrent(Number(e));
    setPageCur(1);
  };

  return (
    <BoxOuter>
      {Toast}
      <Card>
        <Box>
          <ActiveBox>
            <TitBox>
              <div className="titLft">
                <Tabs defaultActiveKey={0} onSelect={(e) => selectCurrent(e)}>
                  <Tab title={t('event.events')} eventKey={0} />
                  <Tab title={t('event.MyEvents')} eventKey={1} disabled={!canCreateEvent} />
                </Tabs>
              </div>

              {/*<span>Events</span>*/}
              {canCreateEvent && (
                <RhtBoxT>
                  <Button onClick={() => navigate('/event/edit')}>{t('event.create')}</Button>
                </RhtBoxT>
              )}
            </TitBox>
            <Row>
              {list?.map((item, idx) => (
                <Col
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  key={idx}
                  onClick={() => navigate(`/event/view?id=${item?.id}`)}
                >
                  <CardBox>
                    <Item>
                      <ImageBox>
                        <Photo>
                          <div className="aspect" />
                          <div className="content">
                            <div className="innerImg">
                              <img src={item?.cover_img} alt="" />
                            </div>
                          </div>
                        </Photo>
                      </ImageBox>
                      <div className="title">{item?.title}</div>
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
    </BoxOuter>
  );
}
