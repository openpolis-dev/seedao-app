import styled from 'styled-components';
import React, { useEffect, useState, useMemo } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getUsers } from 'requests/user';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';

import UserCard from 'components/userCard';
import { getCityHallDetail, MemberGroupType } from 'requests/cityHall';
import useQuerySNS from 'hooks/useQuerySNS';
import publicJs from 'utils/publicJs';

import ProfileComponent from '../../profile-components/profile';
import { ContainerPadding } from "../../assets/styles/global";

type UserMap = { [w: string]: IUser };

export default function Node() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { snsMap, theme },
  } = useAuthContext();

  const [id, setId] = useState<number>();
  const [membersGroupMap, setMembersGroupMap] = useState<{ [w: string]: string[] }>({});

  const [showDel, setShowDel] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [userMap, setUserMap] = useState<UserMap>({});
  const [user, setUser] = useState<any>();
  const [sns, setSns] = useState<string>('');

  const { getMultiSNS } = useQuerySNS();

  const handleMembers = (members: string[]) => {
    return members.map((w) => {
      const user = userMap[w.toLowerCase()];
      if (user) {
        return {
          ...user,
          sns: snsMap.get(w.toLowerCase())?.endsWith('.seedao')
            ? snsMap.get(w.toLowerCase())
            : publicJs.AddressToShow(w, 4),
        };
      } else {
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
          wallet: w.toLowerCase(),
          sns: '',
        };
      }
    });
  };

  const [ techMembers] = useMemo(() => {
    return [
      handleMembers(membersGroupMap.G_TECH || []),
    ];
  }, [membersGroupMap, userMap, snsMap]);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const dt = await getCityHallDetail();
      setMembersGroupMap(dt.data.grouped_sponsors);
      setId(dt.data.id);
      const _wallets: string[] = [];
      Object.keys(dt.data.grouped_sponsors).forEach((key) => {
        if (dt.data.grouped_sponsors[key]) {
          _wallets.push(...dt.data.grouped_sponsors[key]);
        }
      });
      const wallets = Array.from(new Set(_wallets));
      getUsersInfo(wallets);
      getMultiSNS(wallets);
    } catch (error) {
      logError(error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
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
      logError('getUsersInfo error:', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const handleProfile = (user: any, sns: string) => {
    setShowModal(true);
    setSns(sns);
    setUser(user);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Box>
      {!showDel && showModal && <ProfileComponent userData={user} theme={theme} sns={sns} handleClose={handleClose} />}


      <ItemBox>
        <Grouptitle>{t('city-hall.nodeMembers')}</Grouptitle>
        <Row>
          {techMembers.map((item, index) => (
            <UserCard
              key={index}
              user={item}
              showEdit={false}
              sns={item?.sns}
              handleProfile={handleProfile}
            />
          ))}
        </Row>
      </ItemBox>


    </Box>
  );
}

const Box = styled.div`
  min-height: 100%;
  .tab-content {
    box-sizing: border-box;
  }
  ${ContainerPadding};
  color: var(--bs-body-color_active);
`;

const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
`;


const Grouptitle = styled.div`
  font-size: 16px;
  font-family: 'Poppins-SemiBold';
  margin-bottom: 12px;
`;

