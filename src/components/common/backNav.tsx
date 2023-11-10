import styled from 'styled-components';
import BackIconSVG from 'components/svgs/back';
import { Link } from 'react-router-dom';

interface IProps {
  to: string;
  title: string;
  mb?: string; // margin-bottom
}

export default function BackerNav({ to, title, mb }: IProps) {
  return (
    <BackBox mb={mb}>
      <BackIconBox to={to}>
        <BackIconSVG />
      </BackIconBox>
      <span>{title}</span>
    </BackBox>
  );
}

const BackBox = styled.div<{ mb?: string }>`
  display: inline-flex;
  align-items: center;
  margin-bottom: ${(props) => props.mb || '40px'};
`;

const BackIconBox = styled(Link)`
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--bs-box--background);
  border: 1px solid var(--option-button-border-color);
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
