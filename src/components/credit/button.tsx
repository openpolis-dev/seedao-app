import React from 'react';
import styled, { css } from 'styled-components';

interface IProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function CreditButton({ children, ...props }: IProps) {
  return <ButtonStyle {...props}>{children}</ButtonStyle>;
}

export function CreditPlainButton({ children, ...props }: IProps) {
  return <PlainButtonStyle {...props}>{children}</PlainButtonStyle>;
}

const BasicButtonStyle = css`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-family: Poppins-SemiBold;
`;

const ButtonStyle = styled.button`
  ${BasicButtonStyle};
  background: #1814f3;
  color: #fff;
  &:disabled {
    background: rgba(24, 20, 243, 0.7);
    cursor: not-allowed;
  }
`;

const PlainButtonStyle = styled.button`
  ${BasicButtonStyle};
  background: #fff;
  border: 1px solid #718ebf;
  color: #343c6a;
  line-height: 38px;
`;
