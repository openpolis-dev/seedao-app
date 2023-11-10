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
    setToDeleteUser(undefined);
  };

  const handleRemove = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const params: IUpdateStaffsParams = { action: 'remove' };
      if (toDeleteUser?.role === UserRole.Admin) {
        params.sponsors = [toDeleteUser.user.wallet || ''];
      } else if (toDeleteUser) {
        params.members = [toDeleteUser.user.wallet || ''];
      }
      await updateStaffs(id as string, params);
      handleCloseRemoveModal();
      showToast(t('Guild.RemoveMemSuccess'), ToastType.Success);
      updateProject();
    } catch (e) {
      console.error(e);
      showToast(JSON.stringify(e), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  return (
    <Box>
      {show && <Add closeAdd={closeAdd} id={id as string} />}
      {toDeleteUser && (
        <DeleteMemberModal
          title={t('Guild.RemoveMember')}
          sns={nameMap[toDeleteUser.user.wallet || '']}
          user={toDeleteUser.user}
          onClose={handleCloseRemoveModal}
          onConfirm={handleRemove}
        />
      )}
      <TopBox>
        <BlockTitle>{t('Guild.Members')}</BlockTitle>
        {(canUpdateMember || canUpdateSponsor) && (
          <AdeBox onClick={() => setShow(true)}>
            <img src={InviteImg} alt="" />
            <span>{t('Guild.invite')}</span>
          </AdeBox>
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
              removeText={canUpdateSponsor ? t('Guild.RemoveMember') : ''}
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
              removeText={canUpdateSponsor ? t('Guild.RemoveMember') : ''}
              showRemoveModal={handleShowRemoveModal}
            />
          ))}
        </div>
      </ItemBox>
    </Box>
  );
}

const Box = styled.div``;

const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const AdeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
  padding: 0 8px;
  gap: 6px;
  cursor: pointer;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 70px;
  button {
    margin-left: 20px;
  }
`;

const BlockTitle = styled.div`
  color: var(--bs-body-color_active);
  font-size: 24px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
`;
