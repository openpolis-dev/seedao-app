import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMyProjects, getProjects } from 'requests/project';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import Page from 'components/pagination';
import { ReTurnProject } from 'type/project.type';
import NoItem from 'components/noItem';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import useCheckLogin from 'hooks/useCheckLogin';
import ProjectOrGuildItem from 'components/projectOrGuildItem';
import { ContainerPadding } from 'assets/styles/global';

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const CardBox = styled.div`
  background: #fff;
  padding: 10px 40px;
  box-sizing: border-box;
  min-height: 100%;
`;

const Box = styled.div`
  position: relative;
  .tab-content {
    padding: 0 !important;
  }
  a:hover {
    color: #fff;
    opacity: 0.8;
  }
`;

const TopLine = styled.div`
  position: absolute;
  right: 0;
  top: 14px;
  z-index: 9;
  cursor: pointer;
`;

const ItemBox = styled.div`
  margin-top: 40px;
  overflow-x: hidden;
`;

export interface listObj {
  name: string;
  id: number;
}

export default function Index() {
  const { t } = useTranslation();
  const canCreateProj = usePermission(PermissionAction.Create, PermissionObject.Project);
  const {
    state: { language, account },
    dispatch,
  } = useAuthContext();
  const isLogin = useCheckLogin(account);
  const navigate = useNavigate();

  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(1);

  const [current, setCurrent] = useState<number>(0);
  const [list, setList] = useState<listObj[]>([]);
  const [proList, setProList] = useState<ReTurnProject[]>([]);

  useEffect(() => {
    if (current < 2) {
      getList();
    } else {
      getMyList();
    }
  }, [pageCur, current]);

  useEffect(() => {
    const _list = [
      {
        name: t('Project.AllProjects'),
        id: 0,
      },
      {
        name: t('Project.Closed'),
        id: 1,
      },
    ];
    if (isLogin) {
      _list.push({
        name: t('Project.Joined'),
        id: 2,
      });
    }
    setList(_list);
  }, [language, isLogin]);

  const getList = async () => {
    if (current > 2) return;
    const stt = current === 1 ? 'closed' : '';
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const obj: IPageParams = {
      status: stt,
      page: pageCur,
      size: pageSize,
      sort_order: 'desc',
      sort_field: 'created_at',
    };
    const rt = await getProjects(obj, false);
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    const { rows, page, size, total } = rt.data;
    setProList(rows);
    setPageSize(size);
    setTotal(total);
    setPageCur(page);
  };

  const getMyList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const obj: IPageParams = {
      page: pageCur,
      size: pageSize,
      sort_order: 'desc',
      sort_field: 'created_at',
    };
    const rt = await getMyProjects(obj);
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    const { rows, page, size, total } = rt.data;
    setProList(rows);
    setPageSize(size);
    setTotal(total);
    setPageCur(page);
  };
  const selectCurrent = (e: number) => {
    setCurrent(Number(e));
    setPageCur(1);
  };
  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };

  const openDetail = (id: number) => {
    navigate(`/project/info/${id}`);
  };

  return (
    <OuterBox>
      <CardBox>
        <Box>
          <TopLine>
            {canCreateProj && <Button onClick={() => navigate('/create-project')}>{t('Project.create')}</Button>}
          </TopLine>
          <div>
            <Tabs defaultActiveKey={0} onSelect={(e: any) => selectCurrent(e)}>
              {list.map((item, index) => (
                <Tab key={item.id} title={item.name} eventKey={index} />
              ))}
            </Tabs>
            <div>
              <ItemBox>
                <Row>
                  {proList.map((item) => (
                    <ProjectOrGuildItem key={item.id} data={item} onClickItem={openDetail} />
                  ))}
                </Row>
              </ItemBox>
              {!proList.length && <NoItem />}
              {total > pageSize && (
                <div>
                  <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
                </div>
              )}
            </div>
          </div>
        </Box>
      </CardBox>
    </OuterBox>
  );
}
