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
import { useParams } from 'react-router-dom';

interface Iprops {
  detail: ReTurnProject | undefined;
  updateProject: () => void;
}

type UserMap = { [w: string]: IUser };

export default function Members(props: Iprops) {
  const { detail, updateProject } = props;

  // const router = useRouter();
  const { id } = useParams();

  const canUpdateMember = usePermission(PermissionAction.UpdateMember, PermissionObject.GuildPrefix + id);
  const canUpdateSponsor = usePermission(PermissionAction.UpdateSponsor, PermissionObject.GuildPrefix + id);

  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [selectAdminArr, setSelectAdminArr] = useState<IUser[]>([]);
  const [selectMemArr, setSelectMemArr] = useState<IUser[]>([]);
  const [memberArr, setMemberArr] = useState<string[]>([]);
  const [adminArr, setAdminArr] = useState<string[]>([]);

  const [userMap, setUserMap] = useState<UserMap>({});

  useEffect(() => {
    if (!id || !detail) return;
    getDetail();
  }, [id, detail]);

  const getUsersInfo = async (wallets: string[]) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const res = await getUsers(wallets);
      const userData: UserMap = {};
      res.data.forEach((r) => {
        userData[r.wallet || ''] = r;
      });
      setUserMap(userData);
    } catch (error) {
      console.error('getUsersInfo error:', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const getDetail = async () => {
    const members = detail?.members || [];
    const sponsors = detail?.sponsors || [];
    setMemberArr(members.map((m) => m.toLowerCase()));
    setAdminArr(sponsors.map((m) => m.toLowerCase()));
    getUsersInfo(Array.from(new Set([...members, ...sponsors])));
  };

  const handleDel = () => {
    setEdit(true);
  };
  const closeDel = () => {
    setEdit(false);
    setShowDel(true);
  };
  const closeAdd = (refresh?: boolean) => {
    setShow(false);
    refresh && updateProject();
  };
  const handleAdd = () => {
    setShow(true);
  };
  const closeRemove = (refresh?: boolean) => {
    setShowDel(false);
    setEdit(false);
    setSelectAdminArr([]);
    setSelectMemArr([]);
    refresh && updateProject();
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
  const handleMemSelect = (selItem: IUser) => {
    const selectHas = selectMemArr.findIndex((item) => item?.wallet === selItem.wallet);
    const arr = [...selectMemArr];
    if (selectHas > -1) {
      arr.splice(selectHas, 1);
    } else {
      arr.push(selItem);
    }
    setSelectMemArr(arr);
  };
  const formatAdminActive = (num: string) => {
    const arr = selectAdminArr.filter((item) => item.wallet === num);
    return !!arr.length;
  };
  const formatMemActive = (num: string) => {
    const arr = selectMemArr.filter((item) => item.wallet === num);
    return !!arr.length;
  };

  const getUser = (wallet: string): IUser => {
    const user = userMap[wallet];
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

  const removeButtonDisabled = useMemo(() => {
    return !selectAdminArr.length && !selectMemArr.length;
  }, [selectAdminArr, selectMemArr]);

  return (
    <Box>
      {show && (
        <Add
          closeAdd={closeAdd}
          id={id as string}
          canUpdateMember={canUpdateMember}
          canUpdateSponsor={canUpdateSponsor}
        />
      )}
      {showDel && (
        <Del id={id as string} closeRemove={closeRemove} selectAdminArr={selectAdminArr} selectMemArr={selectMemArr} />
      )}
      {(canUpdateMember || canUpdateSponsor) && (
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
              <Button onClick={() => closeDel()} disabled={removeButtonDisabled}>
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

      <ItemBox>
        <TitleBox>{t('Guild.Others')}</TitleBox>
        <Row>
          {memberArr.map((item, index) => (
            <UserCard
              key={index}
              user={getUser(item)}
              onSelectUser={handleMemSelect}
              formatActive={formatMemActive}
              showEdit={edit && canUpdateMember}
            />
          ))}
        </Row>
      </ItemBox>
      {!memberArr.length && <NoItem />}
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
