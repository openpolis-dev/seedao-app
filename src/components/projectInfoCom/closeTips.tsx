import styled from 'styled-components';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BasicModal from 'components/modals/basicModal';
import { useMemo, useState } from 'react';

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
  handleClosePro: (content: string) => void;
}

export default function CloseTips(props: Iprops) {
  const { closeModal, handleClosePro } = props;
  const { t } = useTranslation();
  const [content, setContent] = useState('');

  const confirmDisabled = useMemo(() => {
    return !content || !content.trim();
  }, [content]);

  return (
    <BasicModal title={t('Project.CloseProject')} handleClose={closeModal}>
      <CardBody>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder={t('Project.CloseProjectPlaceholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </CardBody>
      <CardFooter>
        <Button variant="outline-primary" className="btnBtmAll" onClick={closeModal}>
          {t('general.cancel')}
        </Button>
        <Button onClick={() => handleClosePro(content)} disabled={confirmDisabled}>
          {t('general.confirm')}
        </Button>
      </CardFooter>
    </BasicModal>
  );
}
