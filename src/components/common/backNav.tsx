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
    <BackBox to={to} mb={mb}>
      <BackIconSVG />
      <span>{title}</span>
    </BackBox>
  );
}

const BackBox = styled(Link)<{ mb?: string }>`
  display: inline-flex;
  align-items: center;
  margin-bottom: ${(props) => props.mb || '48px'};
  cursor: pointer;
  svg {
    margin-right: 10px;
  }
`;
