import React from 'react';
import styled, { css } from 'styled-components';

interface IProps {
  children: React.ReactNode;
  [key: string]: any;
}

export const PinkButton = ({ children, ...props }: IProps) => {
  return <PinkButtonStyle {...props}>{children}</PinkButtonStyle>;
};

export const BlackButton = ({ children, ...props }: IProps) => {
  return <BlackButtonStyle {...props}>{children}</BlackButtonStyle>;
};

export const PrimaryOutlinedButton = ({ children, ...props }: IProps) => {
  return <PrimaryOutlinedButtonStyle {...props}>{children}</PrimaryOutlinedButtonStyle>;
};

const BasicButtonStyle = css`
  min-width: 110px;
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
  border: none;
`;

const PinkButtonStyle = styled.button`
  ${BasicButtonStyle};
  background: #ff7193;
  color: #fff;
  &:disabled {
    background: rgba(255, 113, 147, 0.4);
  }
  &:hover {
    background: #ff83a1;
  }
`;

const BlackButtonStyle = styled.button`
  ${BasicButtonStyle};
  height: 36px;
  line-height: 36px;
  background: var(--menu-color);
  color: var(--bs-body-bg);
  &:disabled {
    background: rgba(255, 113, 147, 0.4);
  }
  &:hover {
    background: var(--button-hover-bg);
  }
`;

const PrimaryOutlinedButtonStyle = styled.button`
  ${BasicButtonStyle};
  height: 36px;
  line-height: 36px;
  background-color: transparent;
  border: 1px solid var(--bs-primary);
  color: var(--bs-primary);
  &:disabled {
    opacity: 0.4;
  }
  &:hover {
    border-color: #6014ff;
    color: #6014ff;
  }
`;