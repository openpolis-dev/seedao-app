import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import React from 'react';
import { Button } from '@paljs/ui/Button';
import useTranslation from 'hooks/useTranslation';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { updateStaffs, IUpdateStaffsParams } from 'requests/guild';
import { DefaultAvatar } from 'utils/constant';
import Image from 'next/image';
import useToast, { ToastType } from 'hooks/useToast';
import { updateMembers } from 'requests/cityHall';

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .btnBtm {
    margin-right: 20px;
  }
  dl,
  dt,
  dd {
    padding: 0;
    margin: 0;
  }
  .title {
    font-weight: bold;
    margin-block: 15px;
  }
`;

const ItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 500px;
  gap: 10px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #edf1f7;
    margin-right: 20px;
  }
`;

interface Iprops {
  closeRemove: () => void;
  selectAdminArr: IUser[];
  selectMemArr: IUser[];
}
export default function Del(props: Iprops) {
  const { closeRemove, selectAdminArr, selectMemArr } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const { Toast, showToast } = useToast();

  const submitUpdate = async () => {
    const params = {
      remove: selectAdminArr.map((item) => item.wallet || ''),
    };

    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await updateMembers(params);
      showToast(t('Guild.RemoveMemSuccess'), ToastType.Success);
    } catch (e) {
      console.error(e);
      showToast(JSON.stringify(e), ToastType.Danger);
    } finally {
      closeRemove();
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  return (
    <Mask>
      <Card>
        {Toast}
        <CardHeader>{t('Guild.RemoveMember')}</CardHeader>
        <CardBody>
          {!!selectAdminArr.length && <div className="title">{t('Guild.Dominator')}</div>}
          {selectAdminArr.map((item, index) => (
            <ItemBox key={index}>
              <div>
                {item.avatar ? (
                  <img src={item.avatar} style={{ width: '40px', height: '40px' }} />
                ) : (
                  <Image src={DefaultAvatar} alt="" width="40px" height="40px" />
                )}
              </div>
              <div>
                <div>{item.name}</div>
                <div>{item.wallet}</div>
              </div>
            </ItemBox>
          ))}
        </CardBody>
        <CardFooter>
          <Button appearance="outline" className="btnBtm" onClick={() => closeRemove()}>
            {t('general.cancel')}
          </Button>
          <Button onClick={() => submitUpdate()}> {t('general.confirm')}</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
