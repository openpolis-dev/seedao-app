import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8} fill="none" {...props}>
    <path
      className="svg-stroke"
      stroke="#B0B0B0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m3.001 6.64 2.174-2.173a.662.662 0 0 0 0-.934L3 1.36"
    />
  </svg>
);
export default SvgComponent;
