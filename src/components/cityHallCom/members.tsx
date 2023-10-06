import styled from 'styled-components';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import Add from './add';
import Del from './Del';
import { useTranslation } from 'react-i18next';
import { ReTurnProject } from 'type/project.type';
import { getUsers } from 'requests/user';
import { IUser } from 'type/user.type';
// import { useRouter } from 'next/router';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import NoItem from 'components/noItem';
import { PermissionObject, PermissionAction } from 'utils/constant';
import usePermission from 'hooks/usePermission';
import UserCard from 'components/userCard';

interface Iprops {
  detail: ReTurnProject | undefined;
  updateProject: () => void;
}

type UserMap = { [w: string]: IUser };

export default function Members(props: Iprops) {
  const { detail, updateProject } = props;
  const canUpdateSponsor = usePermission(PermissionAction.UpdateSponsor, PermissionObject.GuildPrefix + detail?.id);

  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [selectAdminArr, setSelectAdminArr] = useState<IUser[]>([]);
  const [adminArr, setAdminArr] = useState<string[]>([]);

  const [userMap, setUserMap] = useState<UserMap>({});

  useEffect(() => {
    if (!detail) return;
    getDetail();
  }, [detail]);

  const getUsersInfo = async (wallets: string[]) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const res = await getUsers(wallets);
      const userData: UserMap = {};
      res.data.forEach((r) => {
        userData[(r.wallet || '').toLowerCase()] = r;
      });
      setUserMap(userData);
    } catch (error) {
      console.error('getUsersInfo error:', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const getDetail = () => {
    const sponsors = detail?.sponsors || [];
    setAdminArr(sponsors.map((m) => m.toLowerCase()));
    getUsersInfo(Array.from(new Set([...sponsors])));
  };

  const handleDel = () => {
    setEdit(true);
  };
  const closeDel = () => {
    setEdit(false);
    setShowDel(true);
  };
  const closeAdd = () => {
    setShow(false);
    updateProject();
  };
  const handleAdd = () => {
    setShow(true);
  };
  const closeRemove = () => {
    setShowDel(false);
    setEdit(false);
    setSelectAdminArr([]);
    updateProject();
  };

  const handleAdminSelect = (selItem: IUser) => {
    const selectHas = selectAdminArr.findIndex((item) => item?.wallet === selItem.wallet);
    const arr = [...selectAdminArr];
    if (selectHas > -1) {
      arr.splice(selectHas, 1);
    } else {
      arr.push(selItem);
    }
    setSelectAdminArr(arr);
  };
  const formatAdminActive = (num: string) => {
    const arr = selectAdminArr.filter((item) => item.wallet === num);
    return !!arr.length;
  };

  const getUser = (wallet: string): IUser => {
    const user = userMap[wallet.toLowerCase()];
    if (!user) {
      return {
        id: '',
        name: '',
        avatar: '',
        discord_profile: '',
        twitter_profile: '',
        google_profile: '',
        wechat: '',
        mirror: '',
        assets: [],
      };
    }
    return user;
  };

  return (
    <Box>
      {show && <Add closeAdd={closeAdd} canUpdateSponsor={canUpdateSponsor} />}
      {showDel && <Del closeRemove={closeRemove} selectAdminArr={selectAdminArr} />}
      {canUpdateSponsor && (
        <TopBox>
          <Button onClick={() => handleAdd()} disabled={edit}>
            {t('Guild.AddMember')}
          </Button>
          {!edit && (
            <Button variant="outline-primary" onClick={() => handleDel()}>
              {t('Guild.RemoveMember')}
            </Button>
          )}
          {edit && (
            <>
              <Button onClick={() => closeDel()} disabled={!selectAdminArr.length}>
                {t('general.confirm')}
              </Button>
              <Button variant="outline-primary" onClick={() => closeRemove()}>
                {t('general.cancel')}
              </Button>
            </>
          )}
        </TopBox>
      )}
      <ItemBox>
        <TitleBox>{t('Guild.Dominator')}</TitleBox>
        <Row>
          {adminArr.map((item, index) => (
            <UserCard
              key={index}
              user={getUser(item)}
              onSelectUser={handleAdminSelect}
              formatActive={formatAdminActive}
              showEdit={edit && canUpdateSponsor}
            />
          ))}
        </Row>
      </ItemBox>
      {!adminArr.length && <NoItem />}
    </Box>
  );
}

const Box = styled.div`
  padding: 20px;
`;

const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const TitleBox = styled.div`
  font-weight: bold;
  margin-bottom: 30px;
`;

const TopBox = styled.div`
  background: #f5f5f5;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  margin-bottom: 30px;
  button {
    margin-left: 20px;
  }
`;
