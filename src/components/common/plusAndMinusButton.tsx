import styled from 'styled-components';
import { PlusLg, DashLg } from 'react-bootstrap-icons';

export function PlusButton(props: { [key: string]: any }) {
  return (
    <PlusButtonStyle {...props}>
      <PlusLg />
    </PlusButtonStyle>
  );
}

export function MinusButton(props: { [key: string]: any }) {
  return (
    <PlusButtonStyle {...props}>
      <DashLg className="icon-minus" />
    </PlusButtonStyle>
  );
}

interface IProps {
  showMinus: boolean;
  showPlus: boolean;
  onClickMinus?: () => void;
  onClickPlus?: () => void;
  [key: string]: any;
}

export default function PlusMinusButton({ showPlus, showMinus, onClickMinus, onClickPlus, ...props }: IProps) {
  return (
    <ButtonGroup {...props}>
      {showMinus && <MinusButton onClick={onClickMinus} />}
      {showPlus && <PlusButton onClick={onClickPlus} />}
    </ButtonGroup>
  );
}

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const PlusButtonStyle = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
  cursor: pointer;

  background: var(--bs-box--background);
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--option-button-border-color);
  svg {
    position: relative;
    top: 5px;
    color: var(--bs-body-color);
  }
  .icon-minus {
    top: 6px;
  }
`;
