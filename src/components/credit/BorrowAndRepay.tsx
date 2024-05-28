import styled from 'styled-components';
import CreditButton, { CreditPlainButton } from './button';
import BorrowModal from './borrowModal';
import RepayModal from './repayModal';
import { BorrowItemsModal, RepayItemsModal } from './itemsModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { useCreditContext } from 'pages/credit/provider';
import BasicModal from 'components/modals/basicModal';
import { ethers } from 'ethers';

export default function BorrowAndRepay({ isLogin, onUpdate }: { isLogin: boolean; onUpdate: () => void }) {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState<'borrow' | 'repay' | ''>('');
  const [showItemsModal, setShowItemsModal] = useState<'borrow' | 'repay' | ''>('');
  const [showAlert, setShowAlert] = useState(false);

  const {
    dispatch,
    state: { account },
  } = useAuthContext();
  const {
    state: { scoreLendContract },
  } = useCreditContext();

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
      .userBorrowCooldownEndTimestamp(account)
      .then((endTime: ethers.BigNumber) => {
        if (endTime && endTime.toNumber() * 1000 > Date.now()) {
          setShowAlert(true);
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
  const handleCloseModal = (refresh?: boolean, openMine?: boolean) => {
    setShowModal('');
    if (refresh) {
      onUpdate();
      const evt = new CustomEvent('openMine', { detail: { openMine } });
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
      {showAlert && (
        <AlertModal closeColor="#343C6A" handleClose={() => setShowAlert(false)}>
          <AlertContent>{t('Credit.BorrowCooldownMsg')}</AlertContent>
        </AlertModal>
      )}
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

const AlertModal = styled(BasicModal)`
  width: 670px;
`;

const AlertContent = styled.div`
  color: #1814f3;
  text-align: center;
  font-size: 14px;
  line-height: 200px;
`;
