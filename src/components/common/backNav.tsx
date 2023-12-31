import styled from 'styled-components';
import { Link } from 'react-router-dom';
import BackIcon from 'assets/Imgs/back.svg';

interface IProps {
  to: string;
  title: string;
  mb?: string; // margin-bottom
  onClick?: () => void;
}

export default function BackerNav({ to, title, mb, onClick }: IProps) {
  return (
    <BackBox mb={mb} onClick={() => onClick && onClick()}>
      <BackIconBox to={to}>
        <img src={BackIcon} alt="" />
      </BackIconBox>
      <span className="backTitle">{title}</span>
    </BackBox>
  );
}

const BackBox = styled.div<{ mb?: string }>`
  display: inline-flex;
  align-items: center;
  margin-bottom: ${(props) => props.mb || '40px'};
  .backTitle {
    color: var(--bs-body-color_active);
  }
`;

const BackIconBox = styled(Link)`
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(217, 217, 217, 0.5);
  background: var(--bs-box-background);
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
