import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      className="svg-stroke"
      stroke="#B0B0B0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M10 13.28 5.654 8.933a1.324 1.324 0 0 1 0-1.866L10 2.72"
    />
  </svg>
);
export default SvgComponent;
