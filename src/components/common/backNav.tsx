import styled from 'styled-components';
import BackIconSVG from 'components/svgs/back';
import { Link } from 'react-router-dom';

interface IProps {
  to: string;
  title: string;
}

export default function BackerNav({ to, title }: IProps) {
  return (
    <BackBox to={to}>
      <BackIconSVG />
      <span>{title}</span>
    </BackBox>
  );
}

const BackBox = styled(Link)`
  width: 100%;
  display: inline-flex;
  align-items: center;
  margin-bottom: 48px;
  cursor: pointer;
  svg {
    margin-right: 10px;
  }
`;
