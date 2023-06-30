import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import ProjectAllList from './com/list';
import styled from 'styled-components';
import { ButtonLink } from '@paljs/ui/Button';
import { useRouter } from 'next/router';
import { Card, CardHeader } from '@paljs/ui/Card';
import useTranslation from 'hooks/useTranslation';
import { getMyProjects, getProjects } from 'requests/guild';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import Page from 'components/pagination';
import { ReTurnProject } from 'type/project.type';
import NoItem from 'components/noItem';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import useCheckLogin from 'hooks/useCheckLogin';

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
  right: 20px;
  top: 14px;
  z-index: 9;
  cursor: pointer;
`;

const CardBox = styled(Card)``;

export interface listObj {
  name: string;
  id: number;
}

export default function Index() {
  const { t } = useTranslation();
  const canCreateProj = usePermission(PermissionAction.Create, PermissionObject.Guild);
  const {
    state: { language },
    dispatch,
  } = useAuthContext();
  const isLogin = useCheckLogin();
  const router = useRouter();

  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(1);

  const [current, setCurrent] = useState<number>(0);
  const [list, setList] = useState<listObj[]>([]);
  const [proList, setProList] = useState<ReTurnProject[]>([]);

  useEffect(() => {
    if (current === 0) {
      getList();
    } else {
      getMyList();
    }
  }, [pageCur, current]);

  useEffect(() => {
    const _list = [
      {
        name: t('Guild.AllProjects'),
        id: 0,
      },
    ];
    if (isLogin) {
      _list.push({
        name: t('Guild.Joined'),
        id: 1,
      });
    }
    setList(_list);
  }, [language, isLogin]);

  const getList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const obj: IPageParams = {
      page: pageCur,
      size: pageSize,
      sort_order: 'desc',
      sort_field: 'created_at',
    };
    const rt = await getProjects(obj);
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
    setCurrent(e);
    setPageCur(1);
  };
  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };

  return (
    <Layout title="SeeDAO Project">
      <Card>
        <Box>
          <TopLine>
            {canCreateProj && (
              <ButtonLink onClick={() => router.push('/create-guild')} fullWidth shape="Rectangle">
                {t('Guild.create')}
              </ButtonLink>
            )}
          </TopLine>
          <Row>
            <Col breakPoint={{ xs: 12 }}>
              <CardHeader>
                <Tabs activeIndex={0} onSelect={(e) => selectCurrent(e)}>
                  {list.map((item) => (
                    <Tab key={item.id} title={item.name} responsive />
                  ))}
                </Tabs>

                <div>
                  <ProjectAllList list={proList} />
                  {!proList.length && <NoItem />}
                  {total > pageSize && (
                    <div>
                      <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
                    </div>
                  )}
                </div>
              </CardHeader>
            </Col>
          </Row>
        </Box>
      </Card>
    </Layout>
  );
}
