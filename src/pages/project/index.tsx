import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMyProjects, getProjects } from 'requests/project';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import Page from 'components/pagination';
import { ReTurnProject } from 'type/project.type';
import NoItem from 'components/noItem';
import useCheckLogin from 'hooks/useCheckLogin';
import ProjectOrGuildItem from 'components/projectOrGuildItem';
import SubTabbar from 'components/common/subTabbar';

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

const ItemBox = styled.div`
  overflow-x: hidden;
`;

const ListBox = styled.div`
  &:after {
    content: '';
    display: block;
    clear: both;
  }
`;

export interface listObj {
  title: string;
  key: number;
}

export default function Index() {
  const { t } = useTranslation();
  const {
    state: { language, account, theme },
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
        title: t('Project.AllProjects'),
        key: 0,
      },
      // {
      //   title: t('Project.Closed'),
      //   key: 1,
      // },
    ];
    if (isLogin) {
      _list.push({
        title: t('Project.Joined'),
        key: 2,
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

  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };

  const openDetail = (id: number) => {
    navigate(`/project/info/${id}`);
  };

  return (
    <Box>
      {list.length > 1 && (
        <SubTabbarStyle defaultActiveKey={0} tabs={list} onSelect={(v: string | number) => setCurrent(v as number)} />
      )}

      <div>
        <ItemBox>
          <ListBox>
            {proList.map((item) => (
              <ProjectOrGuildItem key={item.id} data={item} onClickItem={openDetail} theme={theme} />
            ))}
          </ListBox>
        </ItemBox>
        {!proList.length && <NoItem />}
        {total > pageSize && (
          <div>
            <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
          </div>
        )}
      </div>
    </Box>
  );
}

const SubTabbarStyle = styled(SubTabbar)`
  margin-top: 12px;
  margin-bottom: 24px;
`;
