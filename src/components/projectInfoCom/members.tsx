import styled from 'styled-components';
import React, { useEffect, useMemo, useState } from 'react';
import Add from './add';
import Del from './Del';
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

interface Iprops {
  detail: ReTurnProject | undefined;
  updateProject: () => void;
}

type UserMap = { [w: string]: IUser };

export default function Members(props: Iprops) {
  const { detail, updateProject } = props;

  const { id } = useParams();

  const canUpdateMember = usePermission(PermissionAction.UpdateMember, PermissionObject.ProjPrefix + id);
  const canUpdateSponsor = usePermission(PermissionAction.UpdateSponsor, PermissionObject.ProjPrefix + id);

  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const [show, setShow] = useState(false);
  const [memberArr, setMemberArr] = useState<any[]>([]);
  const [adminArr, setAdminArr] = useState<any[]>([]);
  const [memberList, setMemberList] = useState<any[]>([]);
  const [adminList, setAdminList] = useState<any[]>([]);

  const [userMap, setUserMap] = useState<UserMap>({});

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
    let Mlist = memberArr.map((item: string) => getUser(item));
    setMemberList([...Mlist]);

    let sList = adminArr.map((item: string) => getUser(item));
    setAdminList([...sList]);
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

  return (
    <Box>
      {show && <Add closeAdd={closeAdd} id={id as string} />}
      {/*{showDel && (*/}
      {/*  <Del*/}
      {/*    id={id as string}*/}
      {/*    nameMap={nameMap}*/}
      {/*    closeRemove={closeRemove}*/}
      {/*    selectAdminArr={selectAdminArr}*/}
      {/*    selectMemArr={selectMemArr}*/}
      {/*  />*/}
      {/*)}*/}
      <TopBox>
        <BlockTitle>{t('Project.Members')}</BlockTitle>
        {(canUpdateMember || canUpdateSponsor) && (
          <AdeBox onClick={() => setShow(true)}>
            <img src={InviteImg} alt="" />
            <span>{t('Project.invite')}</span>
          </AdeBox>
        )}

        {/*{(canUpdateMember || canUpdateSponsor) && (*/}
        {/*  <div>*/}
        {/*    <Button onClick={() => handleAdd()} disabled={edit}>*/}
        {/*      {t('Project.AddMember')}*/}
        {/*    </Button>*/}
        {/*    {!edit && (*/}
        {/*      <Button variant="outline-primary" onClick={() => handleDel()}>*/}
        {/*        {t('Project.RemoveMember')}*/}
        {/*      </Button>*/}
        {/*    )}*/}
        {/*    {edit && (*/}
        {/*      <>*/}
        {/*        <Button onClick={() => closeDel()} disabled={removeButtonDisabled}>*/}
        {/*          {t('general.confirm')}*/}
        {/*        </Button>*/}
        {/*        <Button variant="outline-primary" onClick={() => closeRemove()}>*/}
        {/*          {t('general.cancel')}*/}
        {/*        </Button>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*)}*/}
      </TopBox>

      <ItemBox>
        <div>
          {adminList.map((item: any, index) => (
            <MemberCard key={`admin_${index}`} user={item} sns={nameMap[item?.wallet]} role={UserRole.Admin} />
          ))}
        </div>
        <div>
          {memberList.map((item, index) => (
            <MemberCard key={`user_${index}`} user={item} sns={nameMap[item?.wallet]} role={UserRole.Admin} />
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
