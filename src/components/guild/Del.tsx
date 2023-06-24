import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import React from 'react';
import { Button } from '@paljs/ui/Button';
import useTranslation from 'hooks/useTranslation';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { updateStaffs, IUpdateStaffsParams } from 'requests/guild';
import { DefaultAvatar } from 'utils/constant';

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
    border-radius: 50%;
    border: 1px solid #edf1f7;
    margin-right: 20px;
  }
`;

interface Iprops {
  closeRemove: (refresh?: boolean) => void;
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
    const params: IUpdateStaffsParams = {
      action: 'remove',
    };
    if (!!selectAdminArr.length) {
      params['sponsors'] = selectAdminArr.map((item) => item.wallet || '');
    }
    if (!!selectMemArr.length) {
      params['members'] = selectMemArr.map((item) => item.wallet || '');
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await updateStaffs(id as string, params);
      closeRemove(true);
      showToastr(t('Project.RemoveMemSuccess'), 'Success', 'Primary');
    } catch (e) {
      console.error(e);
      closeRemove();
      showToastr(JSON.stringify(e), 'Failed', 'Danger');
    } finally {
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
            <ItemBox key={index}>
              <div>
                <img src={item.avatar || DefaultAvatar} alt="" />
              </div>
              <div>
                <div>{item.name}</div>
                <div>{item.wallet}</div>
              </div>
            </ItemBox>
          ))}
          {selectMemArr.map((item, index) => (
            <ItemBox key={index}>
              <div>
                <img src={item.avatar || DefaultAvatar} alt="" />
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
