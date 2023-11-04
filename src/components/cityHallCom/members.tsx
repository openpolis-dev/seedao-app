import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import Add from './add';
import Del from './Del';
import { useTranslation } from 'react-i18next';
import { ReTurnProject } from 'type/project.type';
import { getUsers } from 'requests/user';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import NoItem from 'components/noItem';
import { PermissionObject, PermissionAction } from 'utils/constant';
import usePermission from 'hooks/usePermission';
import UserCard from 'components/userCard';
import { useParseSNSList } from 'hooks/useParseSNS';
import { getCityHallDetail } from 'requests/cityHall';

type UserMap = { [w: string]: IUser };

export default function Members() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const [detail, setDetail] = useState<ReTurnProject | undefined>();
  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [selectAdminArr, setSelectAdminArr] = useState<IUser[]>([]);
  const [adminArr, setAdminArr] = useState<string[]>([]);

  const [userMap, setUserMap] = useState<UserMap>({});
  const nameMap = useParseSNSList(adminArr);

  const canUpdateSponsor = usePermission(PermissionAction.UpdateSponsor, PermissionObject.GuildPrefix + detail?.id);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const dt = await getCityHallDetail();
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    setDetail(dt.data);
  };

  useEffect(() => {
    getDetail();
  }, []);

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

  const handleMembers = () => {
    const sponsors = detail?.sponsors || [];
    setAdminArr(sponsors.map((m) => m.toLowerCase()));
    getUsersInfo(Array.from(new Set([...sponsors])));
  };

  useEffect(() => {
    detail && handleMembers();
  }, [detail]);

  const handleDel = () => {
    setEdit(true);
  };
  const closeDel = () => {
    setEdit(false);
    setShowDel(true);
  };
  const closeAdd = (shouldUpdate?: boolean) => {
    setShow(false);
    shouldUpdate && getDetail();
  };
  const handleAdd = () => {
    setShow(true);
  };
  const closeRemove = (shouldUpdate?: boolean) => {
    setShowDel(false);
    setEdit(false);
    setSelectAdminArr([]);
    shouldUpdate && getDetail();
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
    return !!selectAdminArr.find((item) => item.wallet === num);
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
        wechat: '',
        mirror: '',
        bio: '',
        assets: [],
      };
    }
    return user;
  };

  return (
    <Box>
      {show && <Add closeAdd={closeAdd} canUpdateSponsor={canUpdateSponsor} />}
      {showDel && <Del closeRemove={closeRemove} selectAdminArr={selectAdminArr} />}

      <ItemBox>
        {/* <TitleBox>{t('Guild.Moderator')}</TitleBox> */}
        <Row>
          {adminArr.map((item, index) => (
            <UserCard
              key={index}
              user={getUser(item)}
              onSelectUser={handleAdminSelect}
              formatActive={formatAdminActive}
              showEdit={edit && canUpdateSponsor}
              sns={nameMap[getUser(item)?.wallet || '']}
            />
          ))}
        </Row>
      </ItemBox>
      {!adminArr.length && <NoItem />}
      {canUpdateSponsor && (
        <TopBox>
          {!edit && (
            <>
              <Button onClick={() => handleAdd()} disabled={edit}>
                {t('Guild.AddMember')}
              </Button>
              <Button variant="outline-primary" onClick={() => handleDel()}>
                {t('Guild.RemoveMember')}
              </Button>
            </>
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
    </Box>
  );
}

const Box = styled.div``;

const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 18px;
  margin-top: 6px;
`;
