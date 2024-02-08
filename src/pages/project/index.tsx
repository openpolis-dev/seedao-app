import React, { useEffect, useState } from 'react';
import { Row, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMyProjects, getProjects, IProjectPageParams } from 'requests/project';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import Page from 'components/pagination';
import { ReTurnProject } from 'type/project.type';
import NoItem from 'components/noItem';
import useCheckLogin from 'hooks/useCheckLogin';
import ProjectOrGuildItem from 'components/projectOrGuildItem';
import SubTabbar from 'components/common/subTabbar';
import usePermission from '../../hooks/usePermission';
import { PermissionAction, PermissionObject } from '../../utils/constant';
import useQuerySNS from '../../hooks/useQuerySNS';
import { getUsers } from '../../requests/user';
import { IUser } from '../../type/user.type';
import { ethers } from 'ethers';

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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  margin-right: -1%;
`;

export interface listObj {
  title: string;
  key: number;
}

type UserMap = { [w: string]: IUser };
interface IProps {
  walletSearchVal: string | undefined;
  nameSearchVal: string | undefined;
  setShowInput: (v: boolean) => void;
}
export default function Index({ nameSearchVal, walletSearchVal, setShowInput }: IProps) {
  const { t } = useTranslation();
  const {
    state: { language, account, theme },
    dispatch,
  } = useAuthContext();
  const isLogin = useCheckLogin(account);
  const navigate = useNavigate();

  const { getMultiSNS } = useQuerySNS();

  // const [userMap, setUserMap] = useState<UserMap>({});
  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(1);

  const [current, setCurrent] = useState<number>(0);
  const [list, setList] = useState<listObj[]>([]);
  const [proList, setProList] = useState<ReTurnProject[]>([]);
  // const [snsMap, setSnsMap] = useState<any>({});

  useEffect(() => {
    if (current < 2) {
      setShowInput(true);
      getList();
    } else {
      setShowInput(false);
      getMyList();
    }
  }, [pageCur, current, walletSearchVal, nameSearchVal]);

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

  const getUsersDetail = async (dt: any) => {
    const _wallets: string[] = [];
    dt.forEach((key: any) => {
      if (key.sponsors?.length) {
        let w = key.sponsors[0];
        if (ethers.utils.isAddress(w)) {
          _wallets.push(w);
        }
      }
    });
    const wallets = Array.from(new Set(_wallets));
    let rt = await getUsersInfo(wallets);
    let userSns = await getMultiSNS(wallets);

    return {
      userMap: rt,
      userSns,
    };
  };

  const getUsersInfo = async (wallets: string[]) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const res = await getUsers(wallets);
      const userData: UserMap = {};
      res.data.forEach((r) => {
        userData[(r.wallet || '').toLowerCase()] = r;
      });
      // setUserMap(userData);
      return userData;
    } catch (error) {
      logError('getUsersInfo error:', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const getList = async () => {
    if (current > 2) return;
    const stt = current === 1 ? 'closed' : '';
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const obj: IProjectPageParams = {
      status: 'open,pending_close,closed',
      page: pageCur,
      size: pageSize,
      sort_order: 'desc',
      sort_field: 'create_ts',
      keywords: nameSearchVal,
      wallet: walletSearchVal,
    };
    const rt = await getProjects(obj, false);

    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    const { rows, page, size, total } = rt.data;

    let userRT = await getUsersDetail(rows);
    const { userMap, userSns } = userRT;
    rows.map((d: any) => {
      let m = d.sponsors[0];
      if (m) {
        d.user = userMap ? userMap[m] : {};
        d.sns = userSns ? userSns.get(m) : '';
      }
    });

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
      sort_field: 'create_ts',
    };
    const rt = await getMyProjects(obj);
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    const { rows, page, size, total } = rt.data;

    let userRT = await getUsersDetail(rows);
    const { userMap, userSns } = userRT;

    rows.map((d: any) => {
      let m = d.sponsors[0];
      if (m) {
        d.user = userMap ? userMap[m] : {};
        d.sns = userSns ? userSns.get(m) : '';
      }
    });

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
  // const canAuditApplication = usePermission(
  //   PermissionAction.CreateApplication,
  //   PermissionObject.ProjPrefix + detail?.id,
  // );

  return (
    <Box>
      {list.length > 1 && (
        <SubTabbarStyle defaultActiveKey={0} tabs={list} onSelect={(v: string | number) => setCurrent(v as number)} />
      )}

      <div>
        <ItemBox>
          <ListBox>
            {proList.map((item) => (
              <ProjectOrGuildItem key={item.id} data={item} onClickItem={openDetail} />
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
const LineTop = styled.div`
  position: relative;
`;

const RTBox = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const SubTabbarStyle = styled(SubTabbar)`
  margin-top: 12px;
  margin-bottom: 24px;
`;
