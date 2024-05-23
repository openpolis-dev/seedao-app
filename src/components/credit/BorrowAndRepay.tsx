import styled from 'styled-components';
import CreditButton, { CreditPlainButton } from './button';
import BorrowModal from './borrowModal';
import RepayModal from './repayModal';
import { BorrowItemsModal, RepayItemsModal } from './itemsModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { useCreditContext } from 'pages/credit/provider';
import useToast, { ToastType } from 'hooks/useToast';

export default function BorrowAndRepay({ isLogin, onUpdate }: { isLogin: boolean; onUpdate: () => void }) {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState<'borrow' | 'repay' | ''>('');
  const [showItemsModal, setShowItemsModal] = useState<'borrow' | 'repay' | ''>('');

  const {
    dispatch,
    state: { account },
  } = useAuthContext();
  const {
    state: { scoreLendContract },
  } = useCreditContext();

  const { showToast } = useToast();

  const go2Borrow = () => {
    setShowItemsModal('');
    setShowModal('borrow');
  };
  const go2Repay = () => {
    setShowItemsModal('');
    setShowModal('repay');
  };

  const openBorrow = () => {
    if (!isLogin) {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
    // check
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    scoreLendContract
      .userIsInBorrowCooldownPeriod(account)
      .then((r: { isIn: Boolean }) => {
        if (r.isIn) {
          showToast(t('Credit.BorrowCooldownMsg'), ToastType.Danger);
        } else {
          setShowItemsModal('borrow');
        }
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };
  const openRepay = () => {
    if (!isLogin) {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
    setShowItemsModal('repay');
  };
  const handleCloseModal = (openMine?: boolean) => {
    setShowModal('');
    if (openMine) {
      onUpdate();
      const evt = new Event('openMine');
      document.dispatchEvent(evt);
    }
  };

  return (
    <BorrowAndRepayStyle>
      <CreditButton onClick={openBorrow}>{t('Credit.GoToBorrow')}</CreditButton>
      <CreditPlainButton onClick={openRepay}>{t('Credit.GoToRepay')}</CreditPlainButton>
      {showModal === 'borrow' && <BorrowModal handleClose={handleCloseModal} />}
      {showModal === 'repay' && <RepayModal handleClose={handleCloseModal} />}
      {showItemsModal === 'borrow' && (
        <BorrowItemsModal onConfirm={go2Borrow} handleClose={() => setShowItemsModal('')} />
      )}
      {showItemsModal === 'repay' && <RepayItemsModal onConfirm={go2Repay} handleClose={() => setShowItemsModal('')} />}
    </BorrowAndRepayStyle>
  );
}

const BorrowAndRepayStyle = styled.div`
  display: flex;
  margin-top: 30px;
  gap: 20px;
  & > button {
    width: unset;
    min-width: 110px;
  }
`;
