import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { EvaIcon } from '@paljs/ui/Icon';
import { Button } from '@paljs/ui/Button';
import Add from './add';
import Del from './Del';
import useTranslation from 'hooks/useTranslation';
import { ReTurnProject } from 'type/project.type';
import { getUsers } from 'requests/user';
import { IUser } from 'type/user.type';
import Link from 'next/link';
import PublicJs from 'utils/publicJs';
import { useRouter } from 'next/router';
import { Toastr, ToastrRef } from '@paljs/ui/Toastr';
import { AppActionType, useAuthContext } from 'providers/authProvider';

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

const UlBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  li {
    width: 23%;
    margin-right: 2%;
    border: 1px solid #f1f1f1;
    margin-bottom: 40px;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    &:nth-child(4n) {
      margin-right: 0;
    }
    .fst {
      display: flex;
      align-items: center;
      position: relative;
    }
    img {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      margin-right: 20px;
    }
    .topRht {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      background: #f8f8f8;
      border: 1px solid #ccc;
      border-radius: 40px;
      cursor: pointer;
      //.inner{
      //  display:none;
      //  }
    }
    .active {
      border: 1px solid #a16eff;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      .inner {
        width: 10px;
        height: 10px;
        background: #a16eff;
        border-radius: 20px;
      }
    }
  }
`;

const LinkBox = styled.div`
  margin-top: 20px;
  img {
    width: 35px !important;
    height: 35px !important;
    margin-right: 20px;
  }
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

interface Iprops {
  detail: ReTurnProject | undefined;
}
export default function Members(props: Iprops) {
  const { detail } = props;
  const router = useRouter();
  const { id } = router.query;
  const toastrRef = useRef<ToastrRef>(null);
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [selectAdminArr, setSelectAdminArr] = useState<IUser[]>([]);
  const [selectMemArr, setSelectMemArr] = useState<IUser[]>([]);
  const [adminList, setAdminList] = useState<IUser[]>([]);
  const [memberList, setMemberList] = useState<IUser[]>([]);
  const [memberArr, setMemberArr] = useState<string[]>([]);
  const [adminArr, setAdminArr] = useState<string[]>([]);

  useEffect(() => {
    if (!id || !detail) return;
    getDetail();
  }, [id, detail]);

  const getDetail = async () => {
    const { members, sponsors } = detail!;
    setMemberArr(members);
    setAdminArr(sponsors);
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const aL = await getUsers(sponsors);
    setAdminList(aL.data);

    const mL = await getUsers(members);
    setMemberList(mL.data);
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
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
  };
  const handleAdd = () => {
    setShow(true);
  };
  const closeRemove = () => {
    setShowDel(false);
    setEdit(false);
    setSelectAdminArr([]);
    setSelectMemArr([]);
  };

  const handleAdminSelect = (selItem: IUser) => {
    const selectHas = selectAdminArr.findIndex((item) => item?.wallet === selItem.wallet);

    const arr = [...selectAdminArr];
    if (selectHas > 0) {
      arr.splice(selectHas, 1);
    } else {
      arr.push(selItem);
    }
    setSelectAdminArr(arr);
  };
  const handleMemSelect = (selItem: IUser) => {
    const selectHas = selectMemArr.findIndex((item) => item?.wallet === selItem.wallet);
    const arr = [...selectMemArr];
    if (selectHas > 0) {
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

  const showToastr = (message: string, title: string, type: string) => {
    toastrRef.current?.add(message, title, { status: type });
  };

  return (
    <Box>
      {show && (
        <Add
          closeAdd={closeAdd}
          oldMemberList={memberArr}
          oldAdminList={adminArr}
          id={id as string}
          showToastr={showToastr}
        />
      )}
      {showDel && (
        <Del
          id={id as string}
          closeRemove={closeRemove}
          selectAdminArr={selectAdminArr}
          selectMemArr={selectMemArr}
          showToastr={showToastr}
        />
      )}
      <Toastr
        ref={toastrRef}
        position="topEnd"
        status="Primary"
        duration={3000}
        icons={{
          Danger: 'flash-outline',
          Success: 'checkmark-outline',
          Info: 'question-mark-outline',
          Warning: 'alert-triangle-outline',
          Control: 'email-outline',
          Basic: 'email-outline',
          Primary: 'checkmark-outline',
        }}
        hasIcon={true}
        destroyByClick={false}
        preventDuplicates={false}
      />
      <TopBox>
        <Button onClick={() => handleAdd()} disabled={edit}>
          {t('Project.AddMember')}
        </Button>
        {!edit && (
          <Button appearance="outline" onClick={() => handleDel()}>
            {t('Project.RemoveMember')}
          </Button>
        )}
        {edit && (
          <>
            <Button onClick={() => closeDel()}>{t('general.confirm')}</Button>
            <Button appearance="outline" onClick={() => closeRemove()}>
              {t('general.cancel')}
            </Button>
          </>
        )}
      </TopBox>
      <ItemBox>
        <TitleBox>{t('Project.Dominator')}</TitleBox>
        <UlBox>
          {adminList.map((item, index) => (
            <li key={index}>
              <div className="fst">
                <img src={item.avatar} alt="" />
                <div>
                  <div>{t('Project.Nickname')}</div>
                  <div>
                    <span>{PublicJs.AddressToShow(item.wallet!)}</span>
                    <EvaIcon name="clipboard-outline" />
                  </div>
                </div>
                {edit && (
                  <div
                    className={formatAdminActive(item.wallet!) ? 'topRht active' : 'topRht'}
                    onClick={() => handleAdminSelect(item)}
                  >
                    <div className="inner" />
                  </div>
                )}
              </div>
              <LinkBox>
                <Link href={item.twitter_profile}>
                  <img src="/images/twitterNor.svg" alt="" />
                </Link>
                <Link href={item.discord_profile}>
                  <img src="/images/discordNor.svg" alt="" />
                </Link>
              </LinkBox>
            </li>
          ))}
        </UlBox>
      </ItemBox>
      <ItemBox>
        <TitleBox>{t('Project.Others')}</TitleBox>
        <UlBox>
          {memberList.map((item, index) => (
            <li key={index}>
              <div className="fst">
                <img src="" alt="" />
                <div>
                  <div>{t('Project.Nickname')}</div>
                  <div>
                    <span>{PublicJs.AddressToShow(item.wallet!)}</span>
                    <EvaIcon name="clipboard-outline" />
                  </div>
                </div>
                {edit && (
                  <div
                    className={formatMemActive(item.wallet!) ? 'topRht active' : 'topRht'}
                    onClick={() => handleMemSelect(item)}
                  >
                    <div className="inner" />
                  </div>
                )}
              </div>
              <LinkBox>
                <Link href={item.twitter_profile}>
                  <img src="/images/twitterNor.svg" alt="" />
                </Link>
                <Link href={item.discord_profile}>
                  <img src="/images/discordNor.svg" alt="" />
                </Link>
              </LinkBox>
            </li>
          ))}
        </UlBox>
      </ItemBox>
    </Box>
  );
}
