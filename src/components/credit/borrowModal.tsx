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
import { formatDeltaDate } from 'utils/time';

const networkConfig = getConfig().NETWORK;

interface IProps {
  handleClose: (refresh?: boolean, openMine?: boolean) => void;
}

export default function BorrowModal({ handleClose }: IProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [inputNum, setInputNum] = useState<string>('100');
  const [forfeitNum, setForfeitNum] = useState(0);

  const { showToast } = useToast();

  const { handleTransaction, approveToken, handleEstimateGas, checkNetwork, getAllowanceEnough } = useTransaction();

  const {
    dispatch,
    state: { account },
  } = useAuthContext();
  const {
    state: {
      scoreLendContract,
      myScore,
      myAvaliableQuota,
      maxBorrowDays,
      borrowRate,
      minBorrowCoolDown,
      totalAvaliableBorrowAmount,
    },
  } = useCreditContext();
  const [calculating, setCalculating] = useState(false);
  const [allowanceEnough, setAllowanceEnough] = useState(false);
  const [leftTime, setLeftTime] = useState('');

  const scrEnough = Number(inputNum) <= myAvaliableQuota;

  const getButtonText = () => {
    if (leftTime) {
      return leftTime;
    }
    if (!scrEnough) {
      return t('Credit.InsufficientQuota');
    }
    if (!allowanceEnough) {
      return t('Credit.BorrowStepButton1');
    }
  };

  useEffect(() => {
    setStep(scrEnough && allowanceEnough ? 1 : 0);
  }, [scrEnough, allowanceEnough]);

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
      showToast(t('Credit.ApproveSuccessful'), ToastType.Success);
      setStep(1);
      setAllowanceEnough(true);
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
      await handleEstimateGas(TX_ACTION.BORROW, inputNum!);
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
    setInputNum('100');
    setForfeitNum(0);
    setStep(0);
  };

  const checkMine = () => {
    clearModalData();
    handleClose(true, true);
  };

  const steps = [
    {
      title: t('Credit.BorrowTitle'),
      button: (
        <CreditButton
          onClick={checkApprove}
          disabled={calculating || Number(inputNum) < 100 || Number(inputNum) > myAvaliableQuota || leftTime}
        >
          {getButtonText()}
        </CreditButton>
      ),
    },
    {
      title: t('Credit.BorrowTitle'),
      button: (
        <CreditButton
          disabled={calculating || Number(inputNum) < 100 || Number(inputNum) > myAvaliableQuota || leftTime}
          onClick={checkBorrow}
        >
          {leftTime || t('Credit.BorrowStepButton2')}
        </CreditButton>
      ),
    },
    {
      title: t('Credit.BorrowStepTitle3'),
      button: <CreditButton onClick={checkMine}>{t('Credit.BorrowStepButton3')}</CreditButton>,
    },
  ];

  const computeAmount = (num: number) => {
    if (num === 0) {
      setForfeitNum(0);
      setCalculating(false);
      return;
    }
    setCalculating(true);
    const v = ethers.utils.parseUnits(String(num), networkConfig.lend.lendToken.decimals);
    scoreLendContract
      ?.calculateMortgageSCRAmount(v)
      .then((r: ethers.BigNumber) => {
        const fval = Number(ethers.utils.formatUnits(r, networkConfig.SCRContract.decimals));
        setForfeitNum(fval);
        // check allowance
        getAllowanceEnough('scr', fval)
          .then((res) => {
            setAllowanceEnough(!!res);
          })
          .finally(() => {
            setCalculating(false);
          });
      })
      .catch((err: any) => {
        setForfeitNum(0);
        setCalculating(false);
      });
  };

  const onChangeVal = useCallback(debounce(computeAmount, 800), [scoreLendContract]);

  const onChangeInput = (e: any) => {
    const newValue = e.target.value;
    if (newValue === '') {
      setInputNum('');
      computeAmount(0);
      return;
    }
    const numberRegex = /^\d*$/;
    if (!numberRegex.test(newValue)) {
      return;
    }
    setInputNum(newValue);
    setCalculating(true);
    onChangeVal(Number(newValue));
  };

  const handleBlur = () => {
    // 在输入框失去焦点时验证最小和最大值
    const numericValue = parseFloat(inputNum);
    if (!isNaN(numericValue)) {
      if (numericValue > myAvaliableQuota) {
        setInputNum(getShortDisplay(myAvaliableQuota, 0));
        setCalculating(true);
        onChangeVal(Number(getShortDisplay(myAvaliableQuota, 0)));
      } else {
        setInputNum(getShortDisplay(numericValue, 0));
      }
    }
  };

  const handleBorrowMax = () => {
    if (myAvaliableQuota === Number(inputNum)) {
      return;
    }
    setInputNum(getShortDisplay(myAvaliableQuota, 0));
    onChangeVal(Number(getShortDisplay(myAvaliableQuota, 0)));
    setCalculating(true);
  };

  useEffect(() => {
    setCalculating(true);
    onChangeVal(100);
  }, []);

  useEffect(() => {
    scoreLendContract?.userBorrowCooldownEndTimestamp(account).then((endTime: ethers.BigNumber) => {
      if (endTime && endTime.toNumber() * 1000 > Date.now()) {
        setLeftTime(t('Credit.TimeDisplay', { ...formatDeltaDate(endTime.toNumber() * 1000) }));
        if (minBorrowCoolDown) {
          const hours = Math.floor(minBorrowCoolDown / 3600);
          const minutes = minBorrowCoolDown / 60;
          showToast(
            t('Credit.BorrowCooldownMsg', {
              time: hours ? t('Credit.LeftTimeHour', { h: hours }) : t('Credit.LeftTimeMinute', { m: minutes }),
            }),
            ToastType.Danger,
          );
        }
      }
    });
  }, [scoreLendContract]);

  const dayIntrestAmount = inputNum ? getShortDisplay((Number(inputNum) * 10000 * Number(0.0001)) / 10000, 4) : 0;

  return (
    <BorrowModalStyle
      closeColor="#343C6A"
      handleClose={() => {
        clearModalData();
        handleClose(step === 2, false);
      }}
    >
      <ModalTitle>{steps[step].title}</ModalTitle>
      {step === 2 ? (
        <FinishContent>{inputNum} USDT</FinishContent>
      ) : (
        <BorrowContent>
          <LineLabel>
            <span>{t('Credit.BorrowAmount')}</span>
            <span className="max">{t('Credit.MaxBorrowAmount', { amount: myAvaliableQuota.format(0) })}</span>
          </LineLabel>
          <LineBox>
            <div className="left">
              <input type="number" autoFocus value={inputNum} onChange={onChangeInput} onBlur={handleBlur} />
              <MaxButton onClick={handleBorrowMax}>{t('Credit.MaxBorrow')}</MaxButton>
            </div>
            <span className="right">USDT</span>
          </LineBox>
          {Number(inputNum) > myAvaliableQuota && Number(inputNum) > 100 && (
            <MinTip>{t('Credit.MaxBorrowAmount', { amount: myAvaliableQuota.format(0) })}</MinTip>
          )}
          {Number(inputNum) < 100 && <MinTip>{t('Credit.MinBorrow')}</MinTip>}
          {Number(inputNum) > totalAvaliableBorrowAmount &&
            Number(inputNum) >= 100 &&
            Number(inputNum) <= myAvaliableQuota && (
              <MinTip>{t('Credit.RemainBorrowQuota', { amount: totalAvaliableBorrowAmount.format(0) })}</MinTip>
            )}
          <LineTip>{t('Credit.RateAmount', { r: borrowRate, amount: dayIntrestAmount })}</LineTip>
          <LineLabel>{t('Credit.NeedForfeit')}</LineLabel>
          <LineBox>
            <div className="left">
              {calculating ? <CalculateLoading style={{ margin: '20px' }} /> : forfeitNum.format(0)}
            </div>
            <span className="right">SCR</span>
          </LineBox>
          <LineTip>{t('Credit.ForfeitTip')}</LineTip>
          <BorrowTips>
            <p>{t('Credit.BorrowTip1', { day: maxBorrowDays })}</p>
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
  margin-bottom: 16px;
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
  display: flex;
  justify-content: space-between;
  .max {
    margin-right: 76px;
    color: #1814f3;
  }
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
