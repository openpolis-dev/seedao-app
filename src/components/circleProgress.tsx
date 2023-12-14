import * as React from 'react';
import styled from 'styled-components';

const CircleSVG = (props: any) => (
  <svg
    className="circle-container"
    // viewBox="2 -2 28 36"
    width={118}
    height={118}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle className="circle-container__background" r={54} cx={59} cy={59} />
    <circle className="circle-container__progress" r={54} cx={59} cy={59} />
  </svg>
);

interface IProps {
  color: string;
  progress: number;
}

export default function CircleProgress({ color, progress }: IProps) {
  return (
    <CircleProgressStyled color={color} progress={(339.2 * (100 - progress)) / 100}>
      <CircleSVG />
    </CircleProgressStyled>
  );
}

const CircleProgressStyled = styled.div<{ progress: number }>`
  .circle-container {
    transform: rotate(-90deg);
  }

  .circle-container__background {
    fill: none;
    stroke: rgba(218, 211, 255, 0.9);
    stroke-width: 10px;
  }

  .circle-container__progress {
    fill: none;
    stroke-linecap: round;
    stroke: ${(props) => (props.progress === 339.2 ? 'unset' : props.color || 'var(--bs-primary)')};
    stroke-dasharray: 339.2; // means circle total length pi * 2 * r
    stroke-linecap: round;
    stroke-width: 10px;
    stroke-dashoffset: ${(props) => props.progress || 0};
  }
`;
