import BasicModal from 'components/modals/basicModal';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

interface IProps {
  handleClose: () => void;
  handleCancel: () => void;
}

export default function CancelModal({ handleClose, handleCancel }: IProps) {
  const { t } = useTranslation();

  const onConfirm = () => {
    handleCancel();
  };
  return (
    <CancelRegisterModal title={t('SNS.CancelRegister')} handleClose={handleClose}>
      <Content>{t('SNS.CancelTip')}</Content>
      <CardFooter>
        <Button variant="outline-primary" className="btnBtm" onClick={handleClose}>
          {t('general.cancel')}
        </Button>
        <Button onClick={onConfirm}> {t('general.confirm')}</Button>
      </CardFooter>
    </CancelRegisterModal>
  );
}

const CancelRegisterModal = styled(BasicModal)`
  width: 390px;
`;

const Content = styled.div`
  color: var(--bs-body-color_active);
`;

const CardFooter = styled.div`
  text-align: center;
  margin-top: 40px;
  button {
    width: 110px;
  }
`;
