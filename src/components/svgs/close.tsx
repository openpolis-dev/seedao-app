import * as React from 'react';
import { SVGProps } from 'react';

interface IProps extends SVGProps<SVGSVGElement> {
  color?: string;
}
const SvgComponent = ({ color, ...props }: IProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <g stroke={color || '#b0b0b0'} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
      <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zM9.17 14.83l5.66-5.66M14.83 14.83 9.17 9.17" />
    </g>
  </svg>
);
export default SvgComponent;
