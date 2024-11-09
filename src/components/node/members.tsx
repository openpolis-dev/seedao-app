import styled from 'styled-components';
import React, { useEffect, useState, useMemo } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getUsers } from 'requests/user';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';

import UserCard from 'components/userCard';
import { getCityHallDetail, getCityHallNode, MemberGroupType } from "requests/cityHall";
import useQuerySNS from 'hooks/useQuerySNS';
import publicJs from 'utils/publicJs';

import ProfileComponent from '../../profile-components/profile';
import { ContainerPadding } from "../../assets/styles/global";
import BackerNav from "../common/backNav";
import { useNavigate } from "react-router-dom";

type UserMap = { [w: string]: IUser };

export default function Node() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { snsMap, theme },
  } = useAuthContext();

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [userMap, setUserMap] = useState<UserMap|null>(null);
  const [user, setUser] = useState<any>();
  const [sns, setSns] = useState<string>('');
  const [techMembers, setTechMembers] = useState<any[]>([]);
  const [walletList, setWalletList] = useState<string[]>([]);

  const { getMultiSNS } = useQuerySNS();

  const handleMembers = (members: string[]) => {
    return members.map((w) => {
      const user = userMap![w.toLowerCase()];
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

  useEffect(() => {
    if(!userMap || !snsMap)return;
    let rt =  handleMembers(walletList);
    setTechMembers(rt)
  }, [userMap,snsMap]);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const dt = await getCityHallNode();
      const wallets = dt.data;
      setWalletList(wallets)
      await getUsersInfo(wallets);
      await getMultiSNS(wallets);

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

  const toBack = () =>{
    navigate(-1)
  }

  return (
    <Box>
      {showModal && <ProfileComponent userData={user} theme={theme} sns={sns} handleClose={handleClose} />}
      <BackerNav to="" onClick={()=>toBack()} title={t('city-hall.nodeMembers')} mb="0"  />
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
    margin-top: 40px;
`;


const Grouptitle = styled.div`
  font-size: 16px;
  font-family: 'Poppins-SemiBold';
  margin-bottom: 12px;
`;

