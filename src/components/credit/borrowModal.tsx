import { useState } from 'react';
import styled from 'styled-components';
import BasicModal from 'components/modals/basicModal';
import { useTranslation } from 'react-i18next';
import CreditButton from './button';

interface IProps {
  handleClose: (openMine?: boolean) => void;
}

export default function BorrowModal({ handleClose }: IProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [inputNum, setInputNum] = useState(100);
  const [forfeitNum, setForfeitNum] = useState(5000);

  const checkApprove = () => {
    setStep(1);
  };

  const checkBorrow = () => {
    setStep(2);
  };

  const clearModalData = () => {
    setInputNum(0);
    setForfeitNum(0);
    setStep(0);
  };

  const checkMine = () => {
    clearModalData();
    handleClose(true);
  };

  const steps = [
    {
      title: t('Credit.BorrowStepTitle1'),
      button: <CreditButton onClick={checkApprove}>{t('Credit.BorrowStepButton1')}</CreditButton>,
    },
    {
      title: t('Credit.BorrowStepTitle2'),
      button: <CreditButton onClick={checkBorrow}>{t('Credit.BorrowStepButton2')}</CreditButton>,
    },
    {
      title: t('Credit.BorrowStepTitle3'),
      button: <CreditButton onClick={checkMine}>{t('Credit.BorrowStepButton3')}</CreditButton>,
    },
  ];

  const computeAmount = (e: any) => {};

  return (
    <BorrowModalStyle
      closeColor="#343C6A"
      handleClose={() => {
        clearModalData();
        handleClose();
      }}
    >
      <ModalTitle>{steps[step].title}</ModalTitle>
      {step === 2 ? (
        <FinishContent>{inputNum} USDT</FinishContent>
      ) : (
        <BorrowContent>
          <LineLabel>{t('Credit.BorrowAmount')}</LineLabel>
          <LineBox>
            <div className="left">
              <input type="number" autoFocus disabled={step === 1} />
            </div>
            <span className="right">USDT</span>
          </LineBox>
          <LineTip>{t('Credit.RateAmount', { rate: 0.1, amount: 0.5 })}</LineTip>
          <LineLabel>{t('Credit.NeedForfeit')}</LineLabel>
          <LineBox>
            <div className="left">{forfeitNum}</div>
            <span className="right">SCR</span>
          </LineBox>
          <LineTip>{t('Credit.ForfeitTip')}</LineTip>
          <BorrowTips>
            <p>{t('Credit.BorrowTip1')}</p>
            <p>{t('Credit.BorrowTip2')}</p>
          </BorrowTips>
        </BorrowContent>
      )}
      <ConfirmBox>
        {step === 0 && <LineTip style={{ textAlign: 'center' }}>{t('Credit.BorrowTip3')}</LineTip>}
        {steps[step].button}
      </ConfirmBox>
    </BorrowModalStyle>
  );
}

const BorrowModalStyle = styled(BasicModal)`
  width: 670px;
  font-family: inter;
  color: #343c6a;
  .btn-close-modal {
    right: 26px;
    top: 26px;
  }
`;

const ModalTitle = styled.div`
  font-size: 20px;
  text-align: center;
  font-family: Inter-SemiBold;
  font-weight: 600;
  margin-top: 14px;
  line-height: 54px;
`;

const ConfirmBox = styled.div`
  width: 443px;
  margin: 0 auto;
  margin-top: 26px;
`;

const BorrowContent = styled.div`
  width: 443px;
  margin: 0 auto;
`;

const LineLabel = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;

const LineBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  .left {
    background-color: #e6eff5;
    border-radius: 8px;
    border: 1px splid #dfeaf2;
    height: 50px;
    line-height: 50px;
    flex: 1;
    padding-inline: 20px;
    font-size: 20px;
    font-family: Inter-SemiBold;
    font-weight: 600;
  }
  .right {
    font-size: 20px;
    font-family: Inter-Medium;
    font-weight: 500;
    width: 60px;
  }
  input {
    border: none;
    height: 50px;
    padding: 0;
    background-color: transparent;
    font-size: 20px;
    font-family: Inter-SemiBold;
    font-weight: 600;
    color: #343c6a;
    width: 100%;
    &:focus-visible {
      outline: none;
    }
  }
`;

const LineTip = styled.div`
  color: #1814f3;
  font-size: 14px;
  margin-bottom: 16px;
`;

const BorrowTips = styled.div`
  font-size: 14px;
  margin-top: 26px;
  p {
    margin-bottom: 24px;
  }
`;

const FinishContent = styled.div`
  height: 200px;
  text-align: center;
  line-height: 200px;
  font-size: 24px;
  font-family: Inter-SemiBold;
  font-weight: 600;
  color: #1814f3;
`;
