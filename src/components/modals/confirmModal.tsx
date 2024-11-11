import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import BasicModal from './basicModal';
import { useTranslation } from 'react-i18next';

interface IProps {
  title?: string;
  msg: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({ title, msg, onConfirm, onClose }: IProps) {
  const { t } = useTranslation();
  return (
    <BasicModal title={title} handleClose={onClose} style={{ width: '400px' }}>
      <CardText>
        <div className="danger">⚠️</div>
        <div>{msg}</div>
      </CardText>
      <CardFooter>
        <Button variant="outline-primary" className="btnBtm" onClick={onClose}>
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
  text-align: center;
  .danger {
    font-size: 40px;
    margin-block: 20px;
  }
`;

const CardFooter = styled.div`
  text-align: center;
  margin-top: 40px;
    display: flex;
    justify-content: center;
    align-items:center ;
  button {
    width: 110px;
  }
`;
