import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <g className="svg-stroke" stroke="#B0B0B0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
      <path d="M6 14.667h4c3.333 0 4.666-1.334 4.666-4.667V6c0-3.333-1.333-4.667-4.666-4.667H6C2.666 1.333 1.333 2.667 1.333 6v4c0 3.333 1.333 4.667 4.667 4.667ZM6.667 1.333v13.334M6.667 5.667h8M6.667 10.333h8" />
    </g>
  </svg>
);
export default SvgComponent;
