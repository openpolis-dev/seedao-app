import styled from 'styled-components';
import React, { useEffect, useState, useMemo } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Add from './add';
import Del from './Del';
import { useTranslation } from 'react-i18next';
import { getUsers } from 'requests/user';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import NoItem from 'components/noItem';
import { PermissionObject, PermissionAction } from 'utils/constant';
import usePermission from 'hooks/usePermission';
import UserCard from 'components/userCard';
import { getCityHallDetail, MemberGroupType } from 'requests/cityHall';
import useQuerySNS from 'hooks/useQuerySNS';
import publicJs from 'utils/publicJs';
import BookImg from 'assets/Imgs/handbook.svg';
import LinkImg from '../../assets/Imgs/link.svg';
import ProfileComponent from '../../profile-components/profile';

type UserMap = { [w: string]: IUser };

export default function Members() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { snsMap, theme },
  } = useAuthContext();

  const [id, setId] = useState<number>();
  const [membersGroupMap, setMembersGroupMap] = useState<{ [w: string]: string[] }>({});
  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectUsers, setSelectUsers] = useState<{ user: IUser; group: MemberGroupType }[]>([]);

  const [userMap, setUserMap] = useState<UserMap>({});
  const [user, setUser] = useState<any>();
  const [sns, setSns] = useState<string>('');

  const { getMultiSNS } = useQuerySNS();

  const canUpdateSponsor = usePermission(PermissionAction.UpdateSponsor, PermissionObject.GuildPrefix + id);

  const books = useMemo(() => {
    return [
      {
        name: t('Governance.MetaRule'),
        link: 'https://seedao.notion.site/SeeDAO-SIP-2-a4720f18c068455785a7a9ee5fd626ee',
      },
      {
        name: t('Governance.GovernanceBook'),
        link: 'https://seedao.notion.site/SIP-19-cadf3c7691b84e4bbc8b4620110fe9ce',
      },
      {
        name: t('Governance.NodesConferenceRule'),
        link: 'https://seedao.notion.site/SIP-20-720aa499e0124838974dfcb44d4bcb44',
      },
    ];
  }, [t]);

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

  const [govMembers, brandMembers, techMembers] = useMemo(() => {
    return [
      handleMembers(membersGroupMap.G_GOVERNANCE || []),
      handleMembers(membersGroupMap.G_BRANDING || []),
      handleMembers(membersGroupMap.G_TECH || []),
    ];
  }, [membersGroupMap, userMap, snsMap]);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const dt = await getCityHallDetail();
      setMembersGroupMap(dt.data.grouped_sponsors);
      setId(dt.data.id);
      setMembersGroupMap(dt.data.grouped_sponsors);

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

  const allMembers = useMemo(() => {
    const arr: string[] = [];
    Object.keys(membersGroupMap).forEach((key) => {
      arr.push(...(membersGroupMap[key] || []));
    });
    return arr;
  }, [membersGroupMap]);

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
    setSelectUsers([]);
    shouldUpdate && getDetail();
  };

  const handleAdminSelect = (selItem: IUser, group: MemberGroupType) => {
    console.log(showDel);
    const selectHas = selectUsers.findIndex((item) => item.user?.wallet === selItem.wallet);
    const arr = [...selectUsers];
    if (selectHas > -1) {
      arr.splice(selectHas, 1);
    } else {
      arr.push({ user: selItem, group });
    }
    setSelectUsers(arr);
  };
  const formatAdminActive = (num: string) => {
    return !!selectUsers.find((item) => item.user.wallet === num);
  };

  const borderStyle = useMemo(() => {
    return theme ? '1px solid #29282F' : 'unset';
  }, [theme]);

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
      {show && <Add closeAdd={closeAdd} canUpdateSponsor={canUpdateSponsor} oldMembers={allMembers} />}
      {showDel && <Del closeRemove={closeRemove} selectUsers={selectUsers} />}
      {!showDel && showModal && <ProfileComponent userData={user} theme={theme} sns={sns} handleClose={handleClose} />}
      <TopList>
        <Grouptitle>{t('Governance.GovernanceRule')}</Grouptitle>
        <UlBox border={borderStyle}>
          {books.map((item, index) => (
            <Col sm={12} md={6} lg={4} xl={3} key={`book_${index}`}>
              <a href={item.link} target="_blank" rel="noreferrer">
                <div className="boxAll">
                  <div>
                    <img src={BookImg} alt="" />
                    <span>{item.name}</span>
                  </div>
                  <div className="link">
                    {' '}
                    <img src={LinkImg} alt="" />
                  </div>
                </div>
              </a>
            </Col>
          ))}
        </UlBox>
      </TopList>

      <ItemBox>
        <Grouptitle>{t('city-hall.GovernanceGroup')}</Grouptitle>
        <Row>
          {govMembers.map((item, index) => (
            <UserCard
              key={index}
              user={item}
              onSelectUser={(u) => handleAdminSelect(u, MemberGroupType.Governance)}
              formatActive={formatAdminActive}
              showEdit={edit && canUpdateSponsor}
              sns={item?.sns}
              handleProfile={handleProfile}
            />
          ))}
        </Row>
      </ItemBox>
      <ItemBox>
        <Grouptitle>{t('city-hall.BrandGroup')}</Grouptitle>
        <Row>
          {brandMembers.map((item, index) => (
            <UserCard
              key={index}
              user={item}
              onSelectUser={(u) => handleAdminSelect(u, MemberGroupType.Brand)}
              formatActive={formatAdminActive}
              showEdit={edit && canUpdateSponsor}
              sns={item?.sns}
              handleProfile={handleProfile}
            />
          ))}
        </Row>
      </ItemBox>
      <ItemBox>
        <Grouptitle>{t('city-hall.TechGroup')}</Grouptitle>
        <Row>
          {techMembers.map((item, index) => (
            <UserCard
              key={index}
              user={item}
              onSelectUser={(u) => handleAdminSelect(u, MemberGroupType.Tech)}
              formatActive={formatAdminActive}
              showEdit={edit && canUpdateSponsor}
              sns={item?.sns}
              handleProfile={handleProfile}
            />
          ))}
        </Row>
      </ItemBox>

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
              <Button onClick={() => closeDel()} disabled={!selectUsers.length}>
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

const Grouptitle = styled.div`
  font-size: 16px;
  font-family: 'Poppins-SemiBold';
  margin-bottom: 12px;
`;

const TopList = styled.div`
  margin-bottom: 24px;
`;

const UlBox = styled(Row)`
  .boxAll {
    background: var(--bs-box--background);
    border: ${(props) => props.border};
    padding: 14px;
    border-radius: 8px;
    box-sizing: border-box;
    box-shadow: var(--box-shadow);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .link {
      display: none;
    }
    &:hover {
      background: var(--bs-menu-hover);
      cursor: pointer;
      .link {
        display: block;
      }
    }
    span {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      padding-left: 8px;
    }
  }
`;
