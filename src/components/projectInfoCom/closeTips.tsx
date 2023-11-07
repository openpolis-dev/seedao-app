import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BasicModal from 'components/modals/basicModal';

const CardBody = styled.div`
  color: var(--bs-body-color_active);
  font-size: 14px;
  line-height: 24px;
  width: 400px;
`;
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  .btn {
    width: 110px;
  }
`;
interface Iprops {
  closeModal: () => void;
  handleClosePro: () => void;
}

export default function CloseTips(props: Iprops) {
  const { closeModal, handleClosePro } = props;
  const { t } = useTranslation();

  return (
    <BasicModal title={t('Project.CloseProject')} handleClose={closeModal}>
      <CardBody>{t('Project.confirmClose')}</CardBody>
      <CardFooter>
        <Button variant="outline-primary" className="btnBtmAll" onClick={closeModal}>
          {t('general.cancel')}
        </Button>
        <Button onClick={() => handleClosePro()}>{t('general.confirm')}</Button>
      </CardFooter>
    </BasicModal>
  );
}
