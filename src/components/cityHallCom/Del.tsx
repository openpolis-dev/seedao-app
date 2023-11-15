import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import DefaultAvatar from 'assets/Imgs/defaultAvatar.png';
import useToast, { ToastType } from 'hooks/useToast';
import { updateMembers } from 'requests/cityHall';
import BasicModal from 'components/modals/basicModal';
import { NameMapType } from 'hooks/useParseSNS';

const CardText = styled.div`
  font-size: 14px;
  color: var(--bs-body-color_active);
  line-height: 24px;
  margin-bottom: 24px;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
const CardFooter = styled.div`
  text-align: center;
  margin-top: 40px;
  button {
    width: 110px;
  }
`;

const ItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 500px;
  gap: 12px;
  img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
  .name {
    font-size: 12px;
    color: var(--bs-body-color);
    line-height: 18px;
  }
  .wallet {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 5px;
  }
`;

interface Iprops {
  nameMap: NameMapType;
  closeRemove: (shouldUpdate?: boolean) => void;
  selectAdminArr: IUser[];
  selectMemArr?: IUser[];
}
export default function Del(props: Iprops) {
  const { closeRemove, selectAdminArr, nameMap } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const { showToast } = useToast();

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
      closeRemove(true);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  return (
    <RemoveMemberModalWrapper title={t('members.RemoveTitle')} handleClose={closeRemove}>
      <CardText>{t('members.RemoveConfirm')}</CardText>
      <CardBody>
        {selectAdminArr.map((item, index) => (
          <ItemBox key={index}>
            <div>
              <img src={item.avatar || DefaultAvatar} alt="" />
            </div>
            <div>
              <div className="wallet">{nameMap[item.wallet || ''] || item.wallet}</div>
              <div className="name">{item.name}</div>
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
    </RemoveMemberModalWrapper>
  );
}

const RemoveMemberModalWrapper = styled(BasicModal)`
  width: 470px;
`;
