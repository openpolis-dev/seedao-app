import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { updateStaffs, IUpdateStaffsParams } from 'requests/guild';
import { DefaultAvatar } from 'utils/constant';
import useToast, { ToastType } from 'hooks/useToast';
import { NameMapType } from 'hooks/useParseSNS';

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
const CardHeader = styled.div`
  min-width: 500px;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgb(237, 241, 247);
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  color: rgb(34, 43, 69);
  font-family: Inter-Regular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.5rem;
`;

const CardBody = styled.div`
  padding: 0 20px 20px;
`;
const CardFooter = styled.div`
  padding: 0 20px 20px;
`;
const ItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 500px;
  gap: 10px;
  border-bottom: 1px solid rgb(237, 241, 247);
  padding-block: 10px;
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
  id: string;
  nameMap: NameMapType;
}
export default function Del(props: Iprops) {
  const { closeRemove, selectAdminArr, selectMemArr, id, nameMap } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const { Toast, showToast } = useToast();

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
      showToast(t('Guild.RemoveMemSuccess'), ToastType.Success);
    } catch (e) {
      console.error(e);
      closeRemove();
      showToast(JSON.stringify(e), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  return (
    <Mask>
      <Card>
        {Toast}
        <CardHeader>{t('Guild.RemoveMember')}</CardHeader>
        <CardBody>
          {!!selectAdminArr.length && <div className="title">{t('Guild.Moderator')}</div>}
          {selectAdminArr.map((item, index) => (
            <ItemBox key={index}>
              <div>
                <img src={item.avatar || DefaultAvatar} alt="" style={{ width: '40px', height: '40px' }} />
              </div>
              <div>
                <div>{item.name}</div>
                <div>{item.wallet}</div>
              </div>
            </ItemBox>
          ))}
          {!!selectMemArr.length && <div className="title">{t('Guild.Others')}</div>}
          {selectMemArr.map((item, index) => (
            <ItemBox key={index}>
              <div>
                <img src={item.avatar || DefaultAvatar} alt="" style={{ width: '40px', height: '40px' }} />
              </div>
              <div>
                <div>{(item.wallet && nameMap[item.wallet]) || item.name}</div>
                <div>{item.wallet}</div>
              </div>
            </ItemBox>
          ))}
        </CardBody>
        <CardFooter>
          <Button variant="outline-primary" className="btnBtm" onClick={() => closeRemove()}>
            {t('general.cancel')}
          </Button>
          <Button onClick={() => submitUpdate()}> {t('general.confirm')}</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
