import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BasicModal from 'components/modals/basicModal';

const CardBody = styled.div`
  width: 400px;
  color: var(--bs-body-color_active);
  font-size: 14px;
  line-height: 24px;
`;
const CardFooter = styled.div`
  text-align: center;
  margin-top: 24px;
  button {
    width: 110px;
  }
`;

interface Iprops {
  closeModal: () => void;
}

export default function CloseSuccess(props: Iprops) {
  const { closeModal } = props;
  const { t } = useTranslation();

  return (
    <BasicModal title={t('Project.CloseProject')} handleClose={closeModal}>
      <CardBody>{t('Project.closeTips')}</CardBody>
      <CardFooter>
        <Button onClick={() => closeModal()}>{t('general.ok')}</Button>
      </CardFooter>
    </BasicModal>
  );
}
