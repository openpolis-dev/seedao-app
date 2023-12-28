import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useState } from 'react';
import RejectProposalModal from 'components/modals/rejectProposalModal';
import { ProposalState } from 'type/proposalV2.type';
import { rejectProposal, approveProposal } from 'requests/proposalV2';
import { AppActionType, useAuthContext } from 'providers/authProvider';

interface IProps {
  id: number;
  onUpdateStatus: (status: ProposalState) => void;
}

export default function ReviewProposalComponent({ id, onUpdateStatus }: IProps) {
  const { t } = useTranslation();
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { dispatch } = useAuthContext();

  const handleApprove = () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    approveProposal(id)
      .then(() => {
        onUpdateStatus(ProposalState.Approved);
      })
      .catch((error: any) => {
        logError(`approve proposal-${id} failed`, error);
        // TODO toast
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };

  const handleReject = (reason: string) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    rejectProposal(id, reason)
      .then(() => {
        onUpdateStatus(ProposalState.Rejected);
      })
      .catch((error: any) => {
        logError(`reject proposal-${id} failed`, error);
        // TODO toast
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
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
