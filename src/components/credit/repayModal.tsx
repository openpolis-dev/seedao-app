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
  handleClose: (openMine?: boolean) => void;
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

  const {
    dispatch,
    state: { account },
  } = useAuthContext();

  const {
    state: { bondNFTContract },
  } = useCreditContext();

  const { checkEnoughBalance, handleTransaction, approveToken, handleEstimateGas, checkNetwork } = useTransaction();

  const { showToast } = useToast();

  const clearModalData = () => {
    setStep(0);
    setList(list.map((item) => ({ ...item, selected: false })));
  };

  const checkMine = () => {
    clearModalData();
    handleClose(true);
  };

  const selectedList = list.filter((l) => !!l.selected);

  const onSelect = (id: string, selected: boolean) => {
    const newList = list.map((item) => (item.id === id ? { ...item, selected } : item));
    setList(newList);
  };

  const selectedTotalAmount = Number(
    ethers.utils.formatUnits(
      selectedList.reduce(
        (acc, item) => acc.add(ethers.utils.parseUnits(String(item.total), lendToken.decimals)),
        ethers.constants.Zero,
      ),
      lendToken.decimals,
    ),
  );

  const checkApprove = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await checkNetwork();
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
      const result = await checkEnoughBalance(account!, 'usdt', totalApproveAmount);
      if (!result) {
        throw new Error('Insufficient balance');
      }
      await approveToken('usdt', totalApproveAmount);
      showToast('Approve successfully', ToastType.Success);
      setStep(2);
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
      const result = await handleEstimateGas(
        TX_ACTION.REPAY,
        selectedList.map((item) => Number(item.id)),
      );
      await handleTransaction(
        TX_ACTION.REPAY,
        selectedList.map((item) => Number(item.id)),
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
      const result = (await bondNFTContract?.calculateInterestBatch(ids)) as {
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

  const steps = [
    {
      title: t('Credit.RepayStepTitle1'),
      button: (
        <CreditButton onClick={() => setStep(1)} disabled={!selectedList.length}>
          {t('Credit.RepayStepButton1', { num: selectedList.length })}
        </CreditButton>
      ),
    },
    {
      title: t('Credit.RepayStepTitle2'),
      button: <CreditButton onClick={checkApprove}>{t('Credit.RepayStepButton2')}</CreditButton>,
    },
    {
      title: t('Credit.RepayStepTitle3'),
      button: <CreditButton onClick={checkRepay}>{t('Credit.RepayStepButton3')}</CreditButton>,
    },
    {
      title: t('Credit.RepayStepTitle4'),
      button: <CreditButton onClick={checkMine}>{t('Credit.RepayStepButton4')}</CreditButton>,
    },
  ];
  return (
    <RepayModalStyle handleClose={() => handleClose()} closeColor="#343C6A">
      <ModalTitle>{steps[step].title}</ModalTitle>
      {step === 3 && <FinishContent>{selectedTotalAmount} USDT</FinishContent>}
      {step === 0 && (
        <RepayContent>
          {getting ? (
            <LoadingBox>
              <CalculateLoading />
            </LoadingBox>
          ) : list.length ? (
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
          ) : (
            <NoItem />
          )}
        </RepayContent>
      )}
      {(step === 1 || step === 2) && (
        <RepayContent>
          <TotalRepay>
            <div className="number">{selectedTotalAmount} USDT</div>
            <div className="label">{t('Credit.ShouldRepay')}</div>
          </TotalRepay>
          <ListBox style={{ maxHeight: '352px', minHeight: 'unset' }}>
            {selectedList.map((item) => (
              <SelectedRecord key={item.id} data={item.data} total={item.total} />
            ))}
          </ListBox>
        </RepayContent>
      )}
      <ConfirmBox>
        {(step === 1 || step === 2) && <BorrowTip1>{t('Credit.BorrowTip2')}</BorrowTip1>}
        {steps[step].button}
        {step === 1 && <RepayTip>{t('Credit.RepayTip')}</RepayTip>}
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
      <div className="checkbox-wrapper-40">
        <label>
          <input type="checkbox" checked={selected} />
          <span className="checkbox"></span>
        </label>
      </div>
      <RecordRight>
        <li>
          <span>
            {t('Credit.BorrowID')}: {data.lendIdDisplay}
          </span>
          <span> {data.borrowAmount.format()} USDT</span>
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
            {t('Credit.TotalInterest')} {data.interestAmount} USDT
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
          <span>{data.borrowAmount.format()} USDT</span>
        </li>
        <li>
          <span>
            {t('Credit.BorrowTime')} {data.borrowTime}
          </span>
          <span>{t('Credit.CurrentBorrowDays', { day: data.interestDays })}</span>
        </li>
        <li>
          <span>
            {t('Credit.BorrowPrincipal')} {data.borrowAmount.format()} USDT
          </span>
          <span>{t('Credit.DayRate01', { rate: data.rate })}</span>
        </li>
        <li>
          <span>
            {t('Credit.Interest')} {data.interestAmount}
          </span>
          <span>
            {t('Credit.ShouldRepay')} {total} USDT
          </span>
        </li>
        <li>
          <span>
            {t('Credit.ReturnForfeit')} {data.mortgageSCRAmount.format()} SCR
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
  width: 443px;
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
  width: 443px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RecordStyle = styled.div`
  height: 78px;
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
  .checkbox-wrapper-40 {
    --borderColor: #343c6a;
    --borderWidth: 0.1em;
  }

  .checkbox-wrapper-40 label {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }

  .checkbox-wrapper-40 input[type='checkbox'] {
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
  .checkbox-wrapper-40 input[type='checkbox']:before,
  .checkbox-wrapper-40 input[type='checkbox']:after {
    content: '';
    position: absolute;
    background: var(--borderColor);
    width: calc(var(--borderWidth) * 3);
    height: var(--borderWidth);
    top: 50%;
    left: 10%;
    transform-origin: left center;
  }
  .checkbox-wrapper-40 input[type='checkbox']:before {
    transform: rotate(45deg) translate(calc(var(--borderWidth) / -2), calc(var(--borderWidth) / -2)) scaleX(0);
    transition: transform 200ms ease-in 200ms;
  }
  .checkbox-wrapper-40 input[type='checkbox']:after {
    width: calc(var(--borderWidth) * 5);
    transform: rotate(-45deg) translateY(calc(var(--borderWidth) * 2)) scaleX(0);
    transform-origin: left center;
    transition: transform 200ms ease-in;
  }
  .checkbox-wrapper-40 input[type='checkbox']:checked:before {
    transform: rotate(45deg) translate(calc(var(--borderWidth) / -2), calc(var(--borderWidth) / -2)) scaleX(1);
    transition: transform 200ms ease-in;
  }
  .checkbox-wrapper-40 input[type='checkbox']:checked:after {
    width: calc(var(--borderWidth) * 5);
    transform: rotate(-45deg) translateY(calc(var(--borderWidth) * 2)) scaleX(1);
    transition: transform 200ms ease-out 200ms;
  }
  .checkbox-wrapper-40 input[type='checkbox']:focus {
    outline: calc(var(--borderWidth) / 2) dotted rgba(0, 0, 0, 0.25);
  }
`;

const RecordRight = styled.ul`
  font-size: 10px;
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
    line-height: 16px;
  }
`;

const BorrowTip1 = styled.p`
  color: #1814f3;
  font-size: 14px;
  text-align: center;
  margin-bottom: 22px;
`;

const RepayTip = styled.p`
  color: #718ebf;
  font-size: 12px;
  margin-top: 18px;
`;

const TotalRepay = styled.div`
  margin-top: 20px;
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
