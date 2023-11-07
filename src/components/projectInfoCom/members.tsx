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
import { PermissionObject, PermissionAction } from 'utils/constant';
import usePermission from 'hooks/usePermission';
import UserCard from 'components/userCard';
import { useParams } from 'react-router-dom';
import { useParseSNSList } from 'hooks/useParseSNS';
import DefaultAvatar from '../../assets/Imgs/defaultAvatar.png';
import PublicJs from '../../utils/publicJs';
import InviteImg from '../../assets/Imgs/person-plus.svg';

interface Iprops {
  detail: ReTurnProject | undefined;
  updateProject: () => void;
}

type UserMap = { [w: string]: IUser };

export default function Members(props: Iprops) {
  const { detail, updateProject } = props;

  // const router = useRouter();
  const { id } = useParams();

  const canUpdateMember = usePermission(PermissionAction.UpdateMember, PermissionObject.ProjPrefix + id);
  const canUpdateSponsor = usePermission(PermissionAction.UpdateSponsor, PermissionObject.ProjPrefix + id);

  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [selectAdminArr, setSelectAdminArr] = useState<IUser[]>([]);
  const [selectMemArr, setSelectMemArr] = useState<IUser[]>([]);
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

  const removeButtonDisabled = useMemo(() => {
    return !selectAdminArr.length && !selectMemArr.length;
  }, [selectAdminArr, selectMemArr]);

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
            <InnerBox key={`admin_${index}`}>
              <ImgBox>
                <img className="avatar" src={item.avatar || DefaultAvatar} alt="" />
              </ImgBox>
              <div>
                <div className="snsBox">{nameMap[item?.wallet] || PublicJs.AddressToShow(item.wallet || '')}</div>
                <span className="tagBox">{t('Project.Moderator')}</span>
              </div>
            </InnerBox>
          ))}
        </div>
        <div>
          {memberList.map((item, index) => (
            <InnerBox key={`user_${index}`}>
              <ImgBox>
                <img className="avatar" src={item.avatar || DefaultAvatar} alt="" />
              </ImgBox>
              <div>
                <div className="snsBox">{nameMap[item?.wallet] || PublicJs.AddressToShow(item.wallet || '')}</div>
              </div>
            </InnerBox>
          ))}
        </div>
      </ItemBox>
    </Box>
  );
}

const InnerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 26px;
  .snsBox {
    color: var(--bs-body-color_active);
    font-size: 14px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    line-height: 18px;
    word-break: break-all;
  }
  .tagBox {
    margin-top: 8px;
    display: inline-block;
    height: 20px;
    line-height: 20px;
    background: #2dc45e;
    border-radius: 6px;
    padding: 0 8px;
    color: #000;
    font-size: 12px;
  }
`;

const ImgBox = styled.div`
  margin-right: 12px;
  img {
    width: 44px;
    height: 44px;
    border-radius: 44px;
  }
`;

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
