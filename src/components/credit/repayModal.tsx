import { useState } from 'react';
import styled from 'styled-components';
import BasicModal from 'components/modals/basicModal';
import { useTranslation } from 'react-i18next';
import CreditButton from './button';

interface IProps {
  handleClose: (openMine?: boolean) => void;
}

export default function RepayModal({ handleClose }: IProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [list, setList] = useState([
    { id: 1, data: {}, selected: false },
    { id: 2, data: {}, selected: false },
    { id: 3, data: {}, selected: false },
  ]);

  const clearModalData = () => {
    setStep(0);
    setList(list.map((item) => ({ ...item, selected: false })));
  };

  const checkApprove = () => {
    setStep(2);
  };

  const checkRepay = () => {
    setStep(3);
  };

  const checkMine = () => {
    clearModalData();
    handleClose(true);
  };

  const selectedList = list.filter((l) => !!l.selected);

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

  const onSelect = (id: number, selected: boolean) => {
    const newList = list.map((item) => (item.id === id ? { ...item, selected } : item));
    setList(newList);
  };
  return (
    <RepayModalStyle handleClose={() => handleClose()} closeColor="#343C6A">
      <ModalTitle>{steps[step].title}</ModalTitle>
      {step === 3 && <FinishContent>5,000 USDT</FinishContent>}
      {step === 0 && (
        <RepayContent>
          {list.map((item) => (
            <RecordCheckbox key={item.id} id={item.id} data={item.data} selected={item.selected} onSelect={onSelect} />
          ))}
        </RepayContent>
      )}
      {(step === 1 || step === 2) && (
        <RepayContent>
          <TotalRepay>
            <div className="number">5,000.00 USDT</div>
            <div className="label">{t('Credit.ShouldRepay')}</div>
          </TotalRepay>
          {selectedList.map((item) => (
            <SelectedRecord />
          ))}
        </RepayContent>
      )}
      <ConfirmBox>
        {(step === 1 || step === 2) && <BorrowTip1>{t('Credit.BorrowTip2')}</BorrowTip1>}
        {steps[step].button}
        {(step === 1 || step === 2) && <RepayTip>{t('Credit.RepayTip')}</RepayTip>}
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
  id: number;
  selected?: boolean;
  data: any;
  onSelect: (id: number, selected: boolean) => void;
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
          <span>{t('Credit.BorrowID')}: 8800001</span>
          <span> 5,000.00 USDT</span>
        </li>
        <li>
          <span>{t('Credit.BorrowTime')} 2024-05-02 17:00 UTC+8</span>
          <span>{t('Credit.DayRate01', { rate: 0.1 })}</span>
        </li>
        <li>
          <span>{t('Credit.LastRepaymentTime')} 2024-05-02 17:00 UTC+8</span>
          <span>{t('Credit.TotalInterest')} 10.00 USDT</span>
        </li>
      </RecordRight>
    </RecordStyle>
  );
};

const SelectedRecord = () => {
  const { t } = useTranslation();
  return (
    <SelectRecordStyle>
      <RecordRight>
        <li>
          <span>{t('Credit.BorrowID')}: 8800001</span>
          <span>5,000.00 USDT</span>
        </li>
        <li>
          <span>{t('Credit.BorrowTime')} 2024-05-02 17:00 UTC+8</span>
          <span>{t('Credit.CurrentBorrowDays', { day: 30 })}</span>
        </li>
        <li>
          <span>{t('Credit.BorrowPrincipal')} 1,000.00 USDT</span>
          <span>{t('Credit.DayRate01', { rate: 0.1 })}</span>
        </li>
        <li>
          <span>{t('Credit.Interest')} 10</span>
          <span>{t('Credit.ShouldRepay')} 10.00 USDT</span>
        </li>
        <li>
          <span>{t('Credit.ReturnForfeit')} 1,000.00 SCR</span>
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
