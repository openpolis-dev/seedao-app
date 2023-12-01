import styled from 'styled-components';
import BasicModal from './basicModal';
import { IUser } from 'type/user.type';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DefaultAvatar from 'assets/Imgs/defaultAvatar.png';
import { useMemo } from 'react';
import PublicJs from '../../utils/publicJs';
import { useParseSNSList } from '../../hooks/useParseSNS';

interface IProps {
  title: string;
  users: any[];
  sns?: any;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteMemberModal({ title, sns, users, onConfirm, onClose }: IProps) {
  const { t } = useTranslation();

  return (
    <BasicModal title={title} handleClose={onClose}>
      <CardText>{t('members.RemoveConfirm')}</CardText>
      <CardBody>
        {users.map((item, index) => (
          <ItemBox key={`user_${index}`}>
            <div>
              <img src={item.user.avatar || DefaultAvatar} alt="" />
            </div>
            <div>
              <div className="wallet"> {sns[item.user.wallet || ''] || item.user.wallet}</div>
              <div className="name">{item.user.name}</div>
            </div>
          </ItemBox>
        ))}
      </CardBody>
      <CardFooter>
        <Button variant="outline-primary" className="btnBtm" onClick={() => onClose()}>
          {t('general.cancel')}
        </Button>
        <Button onClick={onConfirm}> {t('general.confirm')}</Button>
      </CardFooter>
    </BasicModal>
  );
}

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
    object-fit: cover;
    object-position: center;
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
    color: var(--bs-body-color_active);
  }
`;
