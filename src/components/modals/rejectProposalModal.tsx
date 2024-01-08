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
  .box {
    padding: 12px 21px;
    &::placeholder {
      color: #bbbbbb;
    }
  }
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
const TipsBox = styled.div`
  margin-bottom: 8px;
`;

interface Iprops {
  closeModal: () => void;
  onConfirm: (content: string) => void;
}

export default function RejectProposalModal({ closeModal, onConfirm }: Iprops) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');

  const confirmDisabled = useMemo(() => {
    return !content || !content.trim();
  }, [content]);

  return (
    <BasicModal handleClose={closeModal}>
      <CardBody>
        <TipsBox>{t('Proposal.FillRejectReason')}</TipsBox>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder={t('general.Placeholder')}
          value={content}
          className="box"
          onChange={(e) => setContent(e.target.value)}
        />
      </CardBody>
      <CardFooter>
        <Button variant="outline-primary" className="btnBtmAll" onClick={closeModal}>
          {t('general.cancel')}
        </Button>
        <Button onClick={() => onConfirm(content)} disabled={confirmDisabled}>
          {t('general.confirm')}
        </Button>
      </CardFooter>
    </BasicModal>
  );
}
