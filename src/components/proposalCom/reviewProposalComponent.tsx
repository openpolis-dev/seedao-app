import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useState } from 'react';
import RejectProposalModal from 'components/modals/rejectProposalModal';

interface IProps {
  onUpdateStatus: (status: string) => void;
}

export default function ReviewProposalComponent({ onUpdateStatus }: IProps) {
  const { t } = useTranslation();
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = () => {
    // TODO
    onUpdateStatus('approved');
  };

  const handleReject = (reason: string) => {
    // TODO
    onUpdateStatus('rejected');
  };
  const onConfirmReject = (reason: string) => {
    setShowRejectModal(false);
    handleReject(reason);
  };

  return (
    <OperateBox>
      <Button onClick={handleApprove}>{t('Proposal.Approve')}</Button>
      <Button variant="outline-primary" onClick={() => setShowRejectModal(true)}>
        {t('Proposal.Reject')}
      </Button>
      {showRejectModal && (
        <RejectProposalModal closeModal={() => setShowRejectModal(false)} onConfirm={onConfirmReject} />
      )}
    </OperateBox>
  );
}

const OperateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  > button {
    flex: 1;
  }
`;
