import React from 'react';
import styled, { css } from 'styled-components';

interface IProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function CreditButton({ children, ...props }: IProps) {
  return <ButtonStyle {...props}>{children}</ButtonStyle>;
}

const BasicButtonStyle = css`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
`;

const ButtonStyle = styled.button`
  ${BasicButtonStyle};
  background: #1814f3;
  font-family: Poppins-SemiBold;
  color: #fff;
`;
