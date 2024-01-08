import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <g stroke="var(--bs-body-color)" strokeWidth={2}>
      <circle cx={10.345} cy={11.321} r={6.108} />
      <path strokeLinecap="round" d="m15.175 15.64 3.686 2.79" />
    </g>
  </svg>
);
export default SvgComponent;
