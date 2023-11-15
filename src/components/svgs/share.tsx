import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <g className="svg-stroke" stroke="#B0B0B0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
      <path d="M9.75 8.25 15.9 2.1M16.5 5.1V1.5h-3.6M8.25 1.5h-1.5C3 1.5 1.5 3 1.5 6.75v4.5C1.5 15 3 16.5 6.75 16.5h4.5c3.75 0 5.25-1.5 5.25-5.25v-1.5" />
    </g>
  </svg>
);
export default SvgComponent;
