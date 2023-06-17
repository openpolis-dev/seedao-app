import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import React, { useEffect } from 'react';
import { Button } from '@paljs/ui/Button';
import useTranslation from 'hooks/useTranslation';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { updateMembers, updateSponsors } from 'requests/project';

const Mask = styled.div`
    background: rgba(0,0,0,0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999999999999999999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btnBtm{
    margin-right: 20px;

  }
  dl,dt,dd{
    padding: 0;
    margin: 0;
`;

const ItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  width: 500px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    margin-right: 20px;
  }
`;

interface Iprops {
  closeRemove: () => void;
  selectAdminArr: IUser[];
  selectMemArr: IUser[];
  showToastr: (a: string, b: string, c: string) => void;
  id: string;
}
export default function Del(props: Iprops) {
  const { closeRemove, selectAdminArr, selectMemArr, id, showToastr } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const submitUpdate = async () => {
    const uniqueM: string[] = [];
    const uniqueAdd: string[] = [];
    selectMemArr.map((item) => {
      uniqueM.push(item.wallet!);
    });
    selectAdminArr.map((item) => {
      uniqueAdd.push(item.wallet!);
    });

    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await updateMembers(id as string, { members: uniqueM });
      closeRemove();
      showToastr(t('Project.RemoveMemSuccess'), 'Success', 'Primary');
      window.location.reload();
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    } catch (e) {
      console.error(e);
      closeRemove();
      showToastr(JSON.stringify(e), 'Failed', 'Danger');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }

    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await updateSponsors(id as string, { sponsors: uniqueAdd });
      closeRemove();
      window.location.reload();
      showToastr(t('Project.RemoveSPSuccess'), 'Success', 'Primary');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    } catch (e) {
      console.error(e);
      closeRemove();
      showToastr(JSON.stringify(e), 'Failed', 'Danger');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  return (
    <Mask>
      <Card>
        <CardHeader>{t('Project.RemoveMember')}</CardHeader>
        <CardBody>
          <div className="tips">{t('Project.ConfirmationPopup')}</div>
          {selectAdminArr.map((item, index) => (
            <ItemBox key={item.wallet}>
              <div>
                <img src={item.avatar} alt="" />
              </div>
              <div>
                <div>{item.name}</div>
                <div>{item.wallet}</div>
              </div>
            </ItemBox>
          ))}
          {selectMemArr.map((item, index) => (
            <ItemBox key={item.wallet}>
              <div>
                <img src={item.avatar} alt="" />
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
