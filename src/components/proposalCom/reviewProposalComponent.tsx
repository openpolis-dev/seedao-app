import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useState } from 'react';
import RejectProposalModal from 'components/modals/rejectProposalModal';
import ConfirmModal from 'components/modals/confirmModal';
import { ProposalState } from 'type/proposalV2.type';
import { rejectProposal, approveProposal } from 'requests/proposalV2';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useMetaforoLogin from 'hooks/useMetaforoLogin';
import useToast, { ToastType } from 'hooks/useToast';

interface IProps {
  id: number;
  onUpdateStatus: (status: ProposalState) => void;
}

export default function ReviewProposalComponent({ id, onUpdateStatus }: IProps) {
  const { t } = useTranslation();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { dispatch } = useAuthContext();
  const { checkMetaforoLogin } = useMetaforoLogin();
  const { showToast } = useToast();

  const handleApprove = () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    approveProposal(id)
      .then(() => {
        onUpdateStatus(ProposalState.Approved);
      })
      .catch((error: any) => {
        logError(`approve proposal-${id} failed`, error);
        showToast(error?.data?.msg || error?.code || error, ToastType.Danger, { autoClose: false });
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
        showToast(error?.data?.msg || error?.code || error, ToastType.Danger, { autoClose: false });
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };
  const onConfirmApprove = () => {
    setShowApproveModal(false);
    handleApprove();
  };

  const onConfirmReject = (reason: string) => {
    setShowRejectModal(false);
    handleReject(reason);
  };

  const onClickApprove = async () => {
    const canApprove = await checkMetaforoLogin();
    if (canApprove) {
      setShowApproveModal(true);
    }
  };

  const onClickReject = async () => {
    const canReject = await checkMetaforoLogin();
    if (canReject) {
      setShowRejectModal(true);
    }
  };

  return (
    <OperateBox>
      <Button variant="outline-primary" onClick={onClickReject}>
        {t('Proposal.Reject')}
      </Button>
      <Button onClick={onClickApprove}>{t('Proposal.Approve')}</Button>

      {showApproveModal && (
        <ConfirmModal
          msg={t('Proposal.ConfirmApproveProposal')}
          onClose={() => setShowApproveModal(false)}
          onConfirm={onConfirmApprove}
        />
      )}
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
    width: 200px;
    height: 40px;
    font-size: 16px;
  }
  .btn-outline-primary {
    background: var(--bs-background);
  }
`;
