import { useEffect, useState } from 'react';
import styled from 'styled-components';
import BasicModal from 'components/modals/basicModal';
import { useTranslation } from 'react-i18next';
import CreditButton from './button';
import { CreditRecordStatus, ICreditRecord } from 'type/credit.type';
import { getBorrowList } from 'requests/credit';
import CalculateLoading from './calculateLoading';
import NoItem from 'components/noItem';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useTransaction, { TX_ACTION } from './useTransaction';
import parseError from './parseError';
import useToast, { ToastType } from 'hooks/useToast';
import { useCreditContext } from 'pages/credit/provider';
import { ethers } from 'ethers';
import getConfig from 'utils/envCofnig';
const lendToken = getConfig().NETWORK.lend.lendToken;

interface IProps {
  handleClose: (refresh?: boolean, openMine?: boolean) => void;
}

type ListItem = {
  id: string;
  data: ICreditRecord;
  selected: boolean;
  total: number;
};

export default function RepayModal({ handleClose }: IProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [list, setList] = useState<ListItem[]>([]);
  const [getting, setGetting] = useState(false);
  const [allowanceBN, setAllowanceBN] = useState(ethers.constants.Zero);
  const [tokenBN, setTokenBN] = useState(ethers.constants.Zero);
  const [allowanceGetting, setAllownceGetting] = useState(false);
  const [tokenBalanceGetting, setTokenBalanceGetting] = useState(false);

  const [totalRepayAmount, setTotalRepayAmount] = useState('0');

  const {
    dispatch,
    state: { account, language },
  } = useAuthContext();

  const {
    state: { bondNFTContract },
  } = useCreditContext();

  const {
    checkEnoughBalance,
    handleTransaction,
    approveToken,
    handleEstimateGas,
    checkNetwork,
    getTokenBalance,
    getTokenAllowance,
  } = useTransaction();

  const { showToast } = useToast();

  const clearModalData = () => {
    setStep(0);
    setList(list.map((item) => ({ ...item, selected: false })));
  };

  const checkMine = () => {
    clearModalData();
    handleClose(true, true);
  };

  const selectedList = list.filter((l) => !!l.selected);

  const onSelect = (id: string, selected: boolean) => {
    const newList = list.map((item) => (item.id === id ? { ...item, selected } : item));
    setList(newList);
  };

  const selectedTotalBN = selectedList.reduce(
    (acc, item) => acc.add(ethers.utils.parseUnits(String(item.total), lendToken.decimals)),
    ethers.constants.Zero,
  );
  const selectedTotalAmount = Number(ethers.utils.formatUnits(selectedTotalBN, lendToken.decimals));
  // add one more day interest
  const totalApproveBN = selectedList.reduce(
    (acc, item) =>
      acc.add(
        ethers.utils
          .parseUnits(String(item.data.interestAmount), lendToken.decimals)
          .div(ethers.BigNumber.from(item.data.interestDays)),
      ),
    ethers.utils.parseUnits(String(selectedTotalAmount), lendToken.decimals),
  );
  const totalApproveAmount = Number(ethers.utils.formatUnits(totalApproveBN, lendToken.decimals));

  const tokenEnough = tokenBN.gte(totalApproveBN);
  const allowanceEnough = allowanceBN.gte(totalApproveBN);

  const getButtonText = () => {
    if (tokenBalanceGetting) {
      return t('Credit.RepayStepButton2', { token: lendToken.symbol });
    }
    if (!tokenEnough) {
      return t('Credit.InsufficientBalance', { token: lendToken.symbol });
    }
    if (!allowanceEnough) {
      return t('Credit.RepayStepButton2', { token: lendToken.symbol });
    }
  };

  const checkApprove = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await checkNetwork();
      const result = await checkEnoughBalance(account!, 'lend', totalApproveAmount);
      if (!result) {
        throw new Error(t('Credit.InsufficientBalance', { token: lendToken.symbol }));
      }
      await approveToken('lend', totalApproveAmount);
      showToast(t('Credit.ApproveSuccessful'), ToastType.Success);
      setStep(2);
      setAllowanceBN(totalApproveBN);
    } catch (error: any) {
      console.error(error);
      showToast(parseError(error), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const checkRepay = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const result = await checkEnoughBalance(account!, 'lend', totalApproveAmount);
      if (!result) {
        throw new Error(t('Credit.InsufficientBalance', { token: lendToken.symbol }));
      }
      const r = await handleEstimateGas(
        TX_ACTION.REPAY,
        selectedList.map((item) => Number(item.id)),
      );
      console.log('estimategas result', r);
      await handleTransaction(
        TX_ACTION.REPAY,
        selectedList.map((item) => Number(item.id)),
        r?.gas,
      );
      setStep(3);
    } catch (error: any) {
      console.error(error);
      showToast(parseError(error), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const getData = async () => {
    try {
      setGetting(true);
      const r = await getBorrowList({
        debtor: account,
        lendStatus: CreditRecordStatus.INUSE,
        sortField: 'borrowTimestamp',
        sortOrder: 'desc',
        page: 1,
        size: 100,
      });
      const ids = r.data.map((d) => Number(d.lendId));
      const _list = r.data.map((item) => ({ id: item.lendId, data: item, selected: false, total: 0 }));
      const result = (await bondNFTContract?.calculateLendsInterest(ids)) as {
        interestAmounts: ethers.BigNumber[];
        interestDays: ethers.BigNumber[];
      };
      ids.forEach((id, idx) => {
        _list[idx].data.interestAmount = Number(
          ethers.utils.formatUnits(result.interestAmounts[idx], lendToken.decimals),
        );
        _list[idx].data.interestDays = result.interestDays[idx].toNumber();
        _list[idx].total = Number(
          ethers.utils.formatUnits(
            result.interestAmounts[idx].add(
              ethers.utils.parseUnits(String(_list[idx].data.borrowAmount), lendToken.decimals),
            ),
            lendToken.decimals,
          ),
        );
      });
      setList(_list);
    } catch (error) {
      console.error(error);
    } finally {
      setGetting(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const selectedAll = !!list.length && list.every((item) => item.selected);
  const handleSelectAll = () => {
    setList(list.map((item) => ({ ...item, selected: !selectedAll })));
  };

  useEffect(() => {
    if (account && step > 0) {
      setAllownceGetting(true);
      getTokenAllowance('lend')
        .then((r) => {
          setAllowanceBN(r);
        })
        .finally(() => {
          setAllownceGetting(false);
        });
    }
  }, [account, step]);

  useEffect(() => {
    if (account && step > 0) {
      setTokenBalanceGetting(true);
      getTokenBalance('lend')
        .then((r) => {
          setTokenBN(r);
        })
        .finally(() => {
          setTokenBalanceGetting(false);
        });
    }
  }, [account, step]);

  console.log('=> step', step);
  console.log('=> usdt', tokenBalanceGetting, tokenBN.toString(), tokenEnough);
  console.log('=> allowance', allowanceGetting, allowanceBN.toString(), allowanceEnough);

  useEffect(() => {
    if (step === 1 || step === 2) {
      setStep(tokenEnough && allowanceEnough ? 2 : 1);
    }
  }, [tokenEnough, allowanceEnough]);

  const steps = [
    {
      title: t('Credit.RepayTitle'),
      button: (
        <CreditButton onClick={() => setStep(1)} disabled={!selectedList.length}>
          {t('Credit.RepayStepButton1', { num: selectedList.length })}
        </CreditButton>
      ),
    },
    {
      title: t('Credit.RepayTitle'),
      button: (
        <CreditButton onClick={checkApprove} disabled={!tokenEnough || tokenBalanceGetting || allowanceGetting}>
          {getButtonText()}
        </CreditButton>
      ),
    },
    {
      title: t('Credit.RepayTitle'),
      button: <CreditButton onClick={checkRepay}>{t('Credit.RepayStepButton3')}</CreditButton>,
    },
    {
      title: t('Credit.RepayStepTitle4'),
      button: <CreditButton onClick={checkMine}>{t('Credit.RepayStepButton4')}</CreditButton>,
    },
  ];

  const getRepayAmount = async (ids: number[], totalPrincipal: ethers.BigNumber) => {
    setGetting(true);
    bondNFTContract
      ?.calculateLendsInterest(ids)
      .then((result: { interestAmounts: ethers.BigNumber[] }) => {
        const total = result.interestAmounts
          .reduce((acc, item) => acc.add(item), ethers.constants.Zero)
          .add(totalPrincipal);
        setTotalRepayAmount(Number(ethers.utils.formatUnits(total, lendToken.decimals)).format(4));
      })
      .catch((e: any) => {
        console.error(e);
        showToast(t('Credit.GetRealRepayAmountFailed'), ToastType.Danger);
      })
      .finally(() => {
        setGetting(false);
      });
  };

  useEffect(() => {
    if (bondNFTContract && step === 3 && selectedList.length) {
      const totalPrincipal = selectedList.reduce(
        (acc, item) => acc.add(ethers.utils.parseUnits(String(item.total), lendToken.decimals)),
        ethers.constants.Zero,
      );
      getRepayAmount(
        selectedList.map((item) => Number(item.id)),
        totalPrincipal,
      );
    }
  }, [bondNFTContract, step]);
  return (
    <RepayModalStyle handleClose={() => handleClose(step === 3, false)} closeColor="#343C6A">
      <ModalTitle>{steps[step].title}</ModalTitle>
      {step === 3 && (
        <FinishContent>
          {selectedTotalAmount.format(4)} {lendToken.symbol}
        </FinishContent>
      )}
      {step === 0 && (
        <RepayContent style={{ width: language === 'zh' ? '453px' : 'unset' }}>
          {getting ? (
            <LoadingBox>
              <CalculateLoading />
            </LoadingBox>
          ) : list.length ? (
            <div>
              <SubTitle>{t('Credit.RepayStepTitle1')}</SubTitle>
              <SelectAllLine>
                <CheckboxStyle className="checkbox-wrapper-40" onClick={handleSelectAll}>
                  <label>
                    <input type="checkbox" checked={selectedAll} />
                    <span className="checkbox"></span>
                  </label>
                </CheckboxStyle>
                <span>{t('Credit.SelectAll')}</span>
              </SelectAllLine>
              <ListBox>
                {list.map((item) => (
                  <RecordCheckbox
                    key={item.id}
                    id={item.id}
                    data={item.data}
                    selected={item.selected}
                    onSelect={onSelect}
                  />
                ))}
              </ListBox>
            </div>
          ) : (
            <NoItem />
          )}
        </RepayContent>
      )}
      {(step === 1 || step === 2) && (
        <RepayContent style={{ width: language === 'zh' ? '453px' : 'unset' }}>
          <TotalRepay>
            <div className="number">
              {totalApproveAmount.format(4)} {lendToken.symbol}
            </div>
            <div className="label">
              {t('Credit.ShouldRepayAll', { amount: selectedTotalAmount.format(4), token: lendToken.symbol })}
            </div>
            <RepayTip>{t('Credit.RepayTip')}</RepayTip>
          </TotalRepay>
          <ListBox style={{ maxHeight: '352px', minHeight: 'unset' }}>
            {selectedList.map((item) => (
              <SelectedRecord key={item.id} data={item.data} total={item.total} />
            ))}
          </ListBox>
        </RepayContent>
      )}
      <ConfirmBox style={{ width: language === 'zh' ? '453px' : 'unset' }}>
        {(step === 1 || step === 2) && <BorrowTip1>{t('Credit.BorrowTip2')}</BorrowTip1>}
        {steps[step].button}
      </ConfirmBox>
    </RepayModalStyle>
  );
}

const RecordCheckbox = ({
  id,
  selected,
  data,
  onSelect,
}: {
  id: string;
  selected?: boolean;
  data: ICreditRecord;
  onSelect: (id: string, selected: boolean) => void;
}) => {
  const { t } = useTranslation();
  return (
    <RecordStyle onClick={() => onSelect(id, !selected)} className={selected ? 'selected' : ''}>
      <CheckboxStyle className="checkbox-wrapper-40">
        <label>
          <input type="checkbox" checked={selected} />
          <span className="checkbox"></span>
        </label>
      </CheckboxStyle>
      <RecordRight>
        <li>
          <span>
            {t('Credit.BorrowID')}: {data.lendIdDisplay}
          </span>
          <span>
            {' '}
            {data.borrowAmount.format(4)} {lendToken.symbol}
          </span>
        </li>
        <li>
          <span>
            {t('Credit.BorrowTime')} {data.borrowTime}
          </span>
          <span>{t('Credit.DayRate01', { rate: data.rate })}</span>
        </li>
        <li>
          <span>
            {t('Credit.LastRepaymentTime')} {data.overdueTime}
          </span>
          <span>
            {t('Credit.TotalInterest')} {data.interestAmount?.format(4)} {lendToken.symbol}
          </span>
        </li>
      </RecordRight>
    </RecordStyle>
  );
};

const SelectedRecord = ({ data, total }: { data: ICreditRecord; total: number }) => {
  const { t } = useTranslation();
  return (
    <SelectRecordStyle>
      <RecordRight>
        <li>
          <span>
            {t('Credit.BorrowID')}: {data.lendIdDisplay}
          </span>
          <span>
            {data.borrowAmount.format(4)} {lendToken.symbol}
          </span>
        </li>
        <li>
          <span>
            {t('Credit.BorrowTime')} {data.borrowTime}
          </span>
          <span>{t('Credit.CurrentBorrowDays', { day: data.interestDays })}</span>
        </li>
        <li>
          <span>
            {t('Credit.BorrowPrincipal')} {data.borrowAmount.format(4)} {lendToken.symbol}
          </span>
          <span>{t('Credit.DayRate01', { rate: data.rate })}</span>
        </li>
        <li>
          <span>
            {t('Credit.Interest')} {data.interestAmount?.format(4)}
          </span>
          <span>
            {t('Credit.ShouldRepay')} {total.format(4)} {lendToken.symbol}
          </span>
        </li>
        <li>
          <span>
            {t('Credit.ReturnForfeit')} {data.mortgageSCRAmount.format(4)} SCR
          </span>
        </li>
      </RecordRight>
    </SelectRecordStyle>
  );
};

const RepayModalStyle = styled(BasicModal)`
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
  width: 453px;
  margin: 0 auto;
  margin-top: 26px;
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

const RepayContent = styled.div`
  width: 453px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxStyle = styled.div`
  &.checkbox-wrapper-40 {
    --borderColor: #343c6a;
    --borderWidth: 0.1em;
  }

  &.checkbox-wrapper-40 label {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }

  &.checkbox-wrapper-40 input[type='checkbox'] {
    -webkit-appearance: none;
    appearance: none;
    vertical-align: middle;
    background: #fff;
    font-size: 1em;
    border-radius: 0.125em;
    display: inline-block;
    border: var(--borderWidth) solid var(--borderColor);
    width: 1em;
    height: 1em;
    position: relative;
  }
  &.checkbox-wrapper-40 input[type='checkbox']:before,
  &.checkbox-wrapper-40 input[type='checkbox']:after {
    content: '';
    position: absolute;
    background: var(--borderColor);
    width: calc(var(--borderWidth) * 3);
    height: var(--borderWidth);
    top: 50%;
    left: 18%;
    transform-origin: left center;
  }
  &.checkbox-wrapper-40 input[type='checkbox']:before {
    transform: rotate(45deg) translate(calc(var(--borderWidth) / -2), calc(var(--borderWidth) / -2)) scaleX(0);
    transition: transform 200ms ease-in 200ms;
  }
  &.checkbox-wrapper-40 input[type='checkbox']:after {
    width: calc(var(--borderWidth) * 5);
    transform: rotate(-45deg) translateY(calc(var(--borderWidth) * 2)) scaleX(0);
    transform-origin: left center;
    transition: transform 200ms ease-in;
  }
  &.checkbox-wrapper-40 input[type='checkbox']:checked:before {
    transform: rotate(45deg) translate(calc(var(--borderWidth) / -2), calc(var(--borderWidth) / -2)) scaleX(1);
    transition: transform 200ms ease-in;
  }
  &.checkbox-wrapper-40 input[type='checkbox']:checked:after {
    width: calc(var(--borderWidth) * 5);
    transform: rotate(-45deg) translateY(calc(var(--borderWidth) * 2)) scaleX(1);
    transition: transform 200ms ease-out 200ms;
  }
  &.checkbox-wrapper-40 input[type='checkbox']:focus {
    outline: calc(var(--borderWidth) / 2) dotted rgba(0, 0, 0, 0.25);
  }
`;

const RecordStyle = styled.div`
  border-radius: 8px;
  display: flex;
  gap: 16px;
  padding: 12px 20px;
  border: 1px solid #718ebf;
  cursor: pointer;
  &.selected {
    background-color: #1814f3;
    color: #fff;
    ul {
      color: rgba(255, 255, 255, 0.7);
      li:first-child {
        color: #fff;
      }
    }
  }
`;

const RecordRight = styled.ul`
  font-size: 12px;
  flex: 1;
  color: #718ebf;
  li {
    display: flex;
    justify-content: space-between;
    &:first-child {
      font-size: 14px;
      color: #343c6a;
    }
  }
`;

const SelectRecordStyle = styled(RecordStyle)`
  height: unset;
  li:first-child {
    margin-bottom: 4px;
  }
  li {
    line-height: 18px;
  }
`;

const BorrowTip1 = styled.p`
  color: #1814f3;
  font-size: 14px;
  margin-bottom: 22px;
`;

const RepayTip = styled.p`
  color: #1814f3;
  font-size: 14px;
  margin-top: 10px;
  text-align: left;
`;

const TotalRepay = styled.div`
  margin-bottom: 20px;
  text-align: center;
  .number {
    color: #1814f3;
    font-size: 24px;
    font-family: Inter-SemiBold;
    font-weight: 600;
  }
  .label {
    font-size: 14px;
  }
`;

const LoadingBox = styled.div`
  height: 321px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ListBox = styled.div`
  max-height: 420px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 321px;
`;

const SubTitle = styled.div`
  font-size: 14px;
  color: #343c6a;
  margin-bottom: 10px;
`;

const SelectAllLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  margin-bottom: 10px;
`;
