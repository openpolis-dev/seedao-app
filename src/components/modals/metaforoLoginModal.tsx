import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import BasicModal from './basicModal';
import { useTranslation } from 'react-i18next';

interface IProps {
  onConfirm: () => void;
  onClose: () => void;
}

export default function MetaforoLoginModal({ onConfirm, onClose }: IProps) {
  const { t } = useTranslation();
  return (
    <BasicModal title={''} handleClose={onClose}>
      <CardText>
        <div>{t('Proposal.LoginTip')}</div>
      </CardText>
      <CardFooter>
        <Button onClick={onConfirm}>{t('Proposal.LoginButton')}</Button>
      </CardFooter>
    </BasicModal>
  );
}

const CardText = styled.div`
  font-size: 14px;
  color: var(--bs-body-color_active);
  line-height: 24px;
  margin-bottom: 24px;
  text-align: center;
  .danger {
    font-size: 40px;
    margin-block: 20px;
  }
`;

const CardFooter = styled.div`
  text-align: center;
  margin-top: 40px;
  button {
    width: 110px;
  }
`;
