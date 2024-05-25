import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import BasicModal from 'components/modals/basicModal';
import { useTranslation } from 'react-i18next';
import CreditButton from './button';
import { useCreditContext } from 'pages/credit/provider';
import CalculateLoading from './calculateLoading';
import { ethers } from 'ethers';
import getConfig from 'utils/envCofnig';
import useTransaction, { TX_ACTION } from './useTransaction';
import { debounce } from 'utils';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import parseError from './parseError';
import { getShortDisplay } from 'utils/number';

const networkConfig = getConfig().NETWORK;

interface IProps {
  handleClose: (openMine?: boolean) => void;
}

export default function BorrowModal({ handleClose }: IProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [inputNum, setInputNum] = useState<string>('100.00');
  const [forfeitNum, setForfeitNum] = useState(0);

  const { showToast } = useToast();

  const { handleTransaction, approveToken, handleEstimateGas, checkNetwork } = useTransaction();

  const { dispatch } = useAuthContext();
  const {
    state: { scoreLendContract, myScore, myAvaliableQuota },
  } = useCreditContext();
  const [calculating, setCalculating] = useState(false);

  const checkApprove = async () => {
    if (calculating || Number(inputNum) < 100) {
      return;
    }
    // check enough
    if (forfeitNum === 0 || myScore < forfeitNum) {
      showToast(t('Credit.InsufficientQuota'), ToastType.Danger);
      return;
    }
    // approve
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await checkNetwork();
      await approveToken('scr', forfeitNum);
      showToast('Approve successfully', ToastType.Success);
      setStep(1);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const checkBorrow = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      await checkNetwork();
      const result = await handleEstimateGas(TX_ACTION.BORROW, inputNum!);
      console.log('====result', result);
      await handleTransaction(TX_ACTION.BORROW, Number(inputNum));
      setStep(2);
    } catch (error: any) {
      logError('[borrow]', error);
      let errorMsg = `${parseError(error)}`;
      if (errorMsg === 'BorrowCooldownTimeTooShort') {
        errorMsg = t('Credit.BorrowCooldownMsg');
      }
      showToast(errorMsg, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const clearModalData = () => {
    setInputNum('100.00');
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

  const computeAmount = (num: number) => {
    if (num === 0) {
      setForfeitNum(0);
      return;
    }
    setCalculating(true);
    const v = ethers.utils.parseUnits(String(num), networkConfig.lend.lendToken.decimals);
    scoreLendContract
      ?.calculateMortgageSCRAmount(v)
      .then((r: ethers.BigNumber) => {
        setForfeitNum(Number(ethers.utils.formatUnits(r, networkConfig.SCRContract.decimals)));
      })
      .finally(() => {
        setCalculating(false);
      });
  };

  const onChangeVal = useCallback(debounce(computeAmount, 1500), [scoreLendContract]);

  const onChangeInput = (e: any) => {
    const newValue = e.target.value;
    if (newValue === '') {
      setInputNum('');
      onChangeVal(0);
      return;
    }
    const numberRegex = /^\d*\.?\d{0,2}$/;
    if (!numberRegex.test(newValue)) {
      return;
    }
    setInputNum(newValue);
    onChangeVal(Number(newValue));
  };

  const handleBlur = () => {
    // 在输入框失去焦点时验证最小和最大值
    const numericValue = parseFloat(inputNum);
    if (!isNaN(numericValue)) {
      if (numericValue > myAvaliableQuota) {
        setInputNum(getShortDisplay(myAvaliableQuota));
        onChangeVal(myAvaliableQuota);
      } else {
        setInputNum(getShortDisplay(numericValue));
      }
    }
  };

  const handleBorrowMax = () => {
    setInputNum(String(myAvaliableQuota));
    onChangeVal(myAvaliableQuota);
  };

  useEffect(() => {
    onChangeVal(100);
  }, []);

  const dayIntrestAmount = inputNum ? getShortDisplay((Number(inputNum) * 10000 * Number(0.0001)) / 10000, 5) : 0;

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
              <input
                type="number"
                autoFocus
                disabled={step === 1}
                value={inputNum}
                onChange={onChangeInput}
                onBlur={handleBlur}
              />
              {step === 0 && <MaxButton onClick={handleBorrowMax}>{t('Credit.MaxBorrow')}</MaxButton>}
            </div>
            <span className="right">USDT</span>
          </LineBox>
          {Number(inputNum) < 100 && <MinTip>{t('Credit.MinBorrow')}</MinTip>}
          <LineTip>{t('Credit.RateAmount', { rate: 0.1, amount: dayIntrestAmount })}</LineTip>
          <LineLabel>{t('Credit.NeedForfeit')}</LineLabel>
          <LineBox>
            <div className="left">
              {calculating ? <CalculateLoading style={{ margin: '20px' }} /> : forfeitNum.format()}
            </div>
            <span className="right">SCR</span>
          </LineBox>
          <LineTip>{t('Credit.ForfeitTip')}</LineTip>
          <BorrowTips>
            <p>{t('Credit.BorrowTip1')}</p>
            <p style={{ color: '#1814f3' }}>{t('Credit.BorrowTip2')}</p>
          </BorrowTips>
        </BorrowContent>
      )}
      <ConfirmBox>
        {step === 0 && <LineTip>{t('Credit.BorrowTip3')}</LineTip>}
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

const MaxButton = styled.span`
  color: #1814f3;
  font-size: 14px;
  line-height: 50px;
  cursor: pointer;
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
    display: flex;
    justify-content: space-between;
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
    width: 250px;
    &:focus-visible {
      outline: none;
    }
  }
`;

const MinTip = styled.p`
  color: #ff7193;
  font-size: 14px;
  margin-top: 4px;
`;

const LineTip = styled.div`
  color: #1814f3;
  font-size: 14px;
  margin-bottom: 16px;
  color: #718ebf;
  margin-top: 4px;
`;

const BorrowTips = styled.div`
  color: #718ebf;
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
