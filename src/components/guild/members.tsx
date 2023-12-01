import styled from 'styled-components';
import React, { useEffect, useMemo, useState } from 'react';
import Add from './add';
import { useTranslation } from 'react-i18next';
import { ReTurnProject } from 'type/project.type';
import { getUsers } from 'requests/user';
import { IUser, UserRole } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { PermissionObject, PermissionAction } from 'utils/constant';
import usePermission from 'hooks/usePermission';
import { useParams } from 'react-router-dom';
import { useParseSNSList } from 'hooks/useParseSNS';
import InviteImg from '../../assets/Imgs/person-plus.svg';
import MemberCard from 'components/common/memberCard';
import DeleteMemberModal from 'components/modals/deleteMemberModal';
import { updateStaffs, IUpdateStaffsParams } from 'requests/guild';
import useToast, { ToastType } from 'hooks/useToast';
import PlusImg from '../../assets/Imgs/light/plus.svg';
import MinusImg from '../../assets/Imgs/light/minus.svg';
import { Button } from 'react-bootstrap';

interface Iprops {
  detail: ReTurnProject | undefined;
  updateProject: () => void;
}

type UserMap = { [w: string]: IUser };

export default function Members(props: Iprops) {
  const { detail, updateProject } = props;
  const { id } = useParams();

  const canUpdateMember = usePermission(PermissionAction.UpdateMember, PermissionObject.GuildPrefix + id);
  const canUpdateSponsor = usePermission(PermissionAction.UpdateSponsor, PermissionObject.GuildPrefix + id);

  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const [show, setShow] = useState(false);
  const [memberArr, setMemberArr] = useState<string[]>([]);
  const [adminArr, setAdminArr] = useState<string[]>([]);

  const [memberList, setMemberList] = useState<any[]>([]);
  const [adminList, setAdminList] = useState<any[]>([]);

  const [userMap, setUserMap] = useState<UserMap>({});
  const [toDeleteUser, setToDeleteUser] = useState<{
    user: IUser;
    role: UserRole;
  }>();

  const [selectUsers, setSelectUsers] = useState<any[]>([]);
  const [showDel, setShowDel] = useState(false);

  const [edit, setEdit] = useState(false);

  const uniqueUsers = useMemo(() => {
    return Array.from(new Set([...memberArr, ...adminArr]));
  }, [memberArr, adminArr]);

  const nameMap = useParseSNSList(uniqueUsers);

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
    let mArr = members.map((m) => m.toLowerCase());
    setMemberArr(mArr);

    let sArr = sponsors.map((m) => m.toLowerCase());

    setAdminArr(sArr);

    getUsersInfo(Array.from(new Set([...members, ...sponsors])));
  };

  useEffect(() => {
    let sList = adminArr.map((item: string) => getUser(item));
    setAdminList([...sList]);

    let Mlist = memberArr.map((item: string) => getUser(item));
    const uniqueArray = Mlist.filter((item2) => !sList.some((item1) => item1.id === item2.id));

    setMemberList([...uniqueArray]);
  }, [memberArr, adminArr, userMap]);

  const closeAdd = (refresh?: boolean) => {
    setShow(false);
    refresh && updateProject();
  };
  const getUser = (wallet: string): IUser => {
    const user = userMap[wallet];
    if (!user) {
      return {
        id: '',
        bio: '',
        name: '',
        avatar: '',
        discord_profile: '',
        twitter_profile: '',
        wechat: '',
        mirror: '',
        assets: [],
      };
    }
    return user;
  };

  const handleShowRemoveModal = (user: IUser, role: UserRole) => {
    setToDeleteUser({ user, role });
  };

  const handleCloseRemoveModal = () => {
    // setToDeleteUser(undefined);
    setShowDel(false);
    setSelectUsers([]);
  };

  const startRemove = () => {
    setEdit(true);
  };

  const handleRemove = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const params: IUpdateStaffsParams = { action: 'remove', sponsors: [], members: [] };
      selectUsers.map((user) => {
        if (user?.role === UserRole.Admin) {
          params.sponsors?.push(user.user.wallet);
        } else {
          params.members?.push(user.user.wallet);
        }
      });
      await updateStaffs(id as string, params);
      handleCloseRemoveModal();
      showToast(t('Project.RemoveMemSuccess'), ToastType.Success);
      updateProject();
    } catch (e) {
      console.error(e);
      showToast(JSON.stringify(e), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const handleAdminSelect = (selItem: IUser, role: number) => {
    const selectHas = selectUsers.findIndex((item) => item?.wallet === selItem.wallet);
    const arr = [...selectUsers];
    if (selectHas > -1) {
      arr.splice(selectHas, 1);
    } else {
      arr.push({ user: selItem, role });
    }
    setSelectUsers(arr);
  };

  const closeRemove = (shouldUpdate?: boolean) => {
    // setShowDel(false);
    setEdit(false);
    setShowDel(false);
    setSelectUsers([]);
    // getDetail();
    // shouldUpdate && getDetail();
  };

  const closeDel = () => {
    setEdit(false);
    setShowDel(true);
    // setShowDel(true);
  };

  return (
    <Box>
      {show && detail && (
        <Add closeAdd={closeAdd} id={id as string} oldMembers={[...detail.sponsors, ...detail.members]} />
      )}
      {showDel && (
        <DeleteMemberModal
          title={t('Guild.RemoveMember')}
          users={selectUsers}
          sns={nameMap}
          onClose={handleCloseRemoveModal}
          onConfirm={handleRemove}
        />
      )}
      <TopBox>
        <BlockTitle>{t('Guild.Members')}</BlockTitle>
        {(canUpdateMember || canUpdateSponsor) && (
          <TopRht>
            <AddBox onClick={() => setShow(true)}>
              <img src={PlusImg} alt="" />
              {/*<span>{t('Project.invite')}</span>*/}
            </AddBox>
            <AddBox onClick={() => startRemove()}>
              <img src={MinusImg} alt="" />
              {/*<span>{t('Project.invite')}</span>*/}
            </AddBox>
          </TopRht>
        )}
      </TopBox>

      <ItemBox>
        <div>
          {adminList.map((item, index) => (
            <MemberCard
              key={`admin_${index}`}
              user={item}
              role={UserRole.Admin}
              sns={nameMap[item.wallet]}
              showEdit={edit}
              onSelectUser={(u) => handleAdminSelect(u, UserRole.Admin)}
              removeText=""
              showRemoveModal={handleShowRemoveModal}
            />
          ))}
        </div>
        <div>
          {memberList.map((item, index) => (
            <MemberCard
              key={`user_${index}`}
              user={item}
              role={UserRole.Member}
              sns={nameMap[item?.wallet]}
              showEdit={edit}
              onSelectUser={(u) => handleAdminSelect(u, UserRole.Member)}
              removeText=""
              // removeText={canUpdateSponsor ? t('Project.RemoveMember') : ''}
              showRemoveModal={handleShowRemoveModal}
            />
          ))}
        </div>
      </ItemBox>
      {edit && (
        <FlexLine>
          <Button onClick={() => closeDel()} disabled={!selectUsers.length}>
            {t('general.confirm')}
          </Button>
          <Button variant="outline-primary" onClick={() => closeRemove()}>
            {t('general.cancel')}
          </Button>
        </FlexLine>
      )}
    </Box>
  );
}

const Box = styled.div``;

const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--bs-border-color);
  cursor: pointer;
  margin-left: 9px;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  button {
    margin-left: 20px;
  }
`;

const BlockTitle = styled.div`
  color: var(--bs-body-color_active);
  font-size: 24px;
  font-family: Poppins-Bold;
  font-weight: bold;
`;
const TopRht = styled.div`
  display: flex;
`;

const FlexLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn {
    width: 48%;
  }
`;
