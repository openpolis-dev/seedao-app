import BasicModal from 'components/modals/basicModal';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CreditButton from './button';

interface Iprops {
  title: string;
  steps: string[];
  confirmText: string;
  onConfirm: () => void;
  handleClose: () => void;
  w: boolean;
}

function ItemsModal({ title, steps, confirmText, onConfirm, handleClose, w }: Iprops) {
  return (
    <ItemsModalStyle closeColor="#343C6A" handleClose={handleClose}>
      <ModalTitle>{title}</ModalTitle>
      <StepsBox style={{ width: w ? '350px' : '260px' }}>
        {steps.map((step, index) => (
          <li key={index}>
            <span className="number">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </StepsBox>
      <ConfirmBox>
        <CreditButton onClick={onConfirm}>{confirmText}</CreditButton>
      </ConfirmBox>
    </ItemsModalStyle>
  );
}

export const BorrowItemsModal = ({ onConfirm, handleClose }: { onConfirm: () => void; handleClose: () => void }) => {
  const { t, i18n } = useTranslation();
  return (
    <ItemsModal
      title={t('Credit.BorrowStepTitle')}
      steps={[t('Credit.BorrowStep1'), t('Credit.BorrowStep2'), t('Credit.BorrowStep3')]}
      onConfirm={onConfirm}
      confirmText={t('Credit.BorrowStepConfirmButton')}
      handleClose={handleClose}
      w={i18n.language === 'en'}
    />
  );
};

export const RepayItemsModal = ({ onConfirm, handleClose }: { onConfirm: () => void; handleClose: () => void }) => {
  const { t, i18n } = useTranslation();
  return (
    <ItemsModal
      title={t('Credit.RepayStepTitle')}
      steps={[t('Credit.RepayStep1'), t('Credit.RepayStep2'), t('Credit.RepayStep3')]}
      onConfirm={onConfirm}
      confirmText={t('Credit.RepayStepConfirmButton')}
      handleClose={handleClose}
      w={i18n.language === 'en'}
    />
  );
};

const ItemsModalStyle = styled(BasicModal)`
  width: 670px;
  font-family: inter;
  .btn-close-modal {
    right: 26px;
    top: 26px;
  }
`;

const ModalTitle = styled.div`
  font-size: 20px;
  text-align: center;
  color: #343c6a;
  font-family: Inter-SemiBold;
  font-weight: 600;
  margin-top: 14px;
`;

const StepsBox = styled.ul`
  color: #343c6a;
  margin: 60px auto;

  li {
    display: flex;
    gap: 24px;
    align-items: center;
    margin-block: 20px;
  }
  .number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #1814f3;
    font-size: 14px;
    text-align: center;
    line-height: 29px;
    color: #1814f3;
  }
`;

const ConfirmBox = styled.div`
  width: 443px;
  margin: 0 auto;
`;
