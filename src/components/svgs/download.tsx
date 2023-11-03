import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <g className="svg-stroke" stroke="#B0B0B0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
      <path d="M8.082 10.29V2.264M10.025 8.339 8.081 10.29 6.137 8.339" />
      <path d="M11.17 5.419h.622c1.357 0 2.456 1.099 2.456 2.456v3.256a2.45 2.45 0 0 1-2.45 2.45H4.371a2.457 2.457 0 0 1-2.456-2.456V7.868a2.45 2.45 0 0 1 2.45-2.45h.628" />
    </g>
  </svg>
);
export default SvgComponent;
