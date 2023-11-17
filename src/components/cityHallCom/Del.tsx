import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { IUser } from 'type/user.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import DefaultAvatar from 'assets/Imgs/defaultAvatar.png';
import useToast, { ToastType } from 'hooks/useToast';
import { MemberGroupType, updateMembers } from 'requests/cityHall';
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
  closeRemove: (shouldUpdate?: boolean) => void;
  selectUsers: { user: IUser; group: MemberGroupType }[];
  selectMemArr?: IUser[];
}
export default function Del(props: Iprops) {
  const { closeRemove, selectUsers } = props;
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const { showToast } = useToast();

  const submitUpdate = async () => {
    const governance_list = selectUsers
      .filter((item) => item.group === MemberGroupType.Governance)
      .map((item) => item.user.wallet || '');
    const brand_list = selectUsers
      .filter((item) => item.group === MemberGroupType.Brand)
      .map((item) => item.user.wallet || '');
    const tech_list = selectUsers
      .filter((item) => item.group === MemberGroupType.Tech)
      .map((item) => item.user.wallet || '');

    const reqArr: Promise<any>[] = [];
    if (governance_list.length) {
      reqArr.push(
        updateMembers({
          remove: governance_list,
          group_name: MemberGroupType.Governance,
        }),
      );
    }
    if (brand_list.length) {
      reqArr.push(
        updateMembers({
          remove: brand_list,
          group_name: MemberGroupType.Brand,
        }),
      );
    }
    if (tech_list.length) {
      reqArr.push(
        updateMembers({
          remove: tech_list,
          group_name: MemberGroupType.Tech,
        }),
      );
    }

    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await Promise.allSettled(reqArr);
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
        {selectUsers.map((item, index) => (
          <ItemBox key={index}>
            <div>
              <img src={item.user.avatar || DefaultAvatar} alt="" />
            </div>
            <div>
              <div className="wallet">{item.user.sns || item.user.wallet}</div>
              <div className="name">{item.user.name}</div>
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
