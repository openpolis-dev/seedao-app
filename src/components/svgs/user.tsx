import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={17} height={16} fill="none" {...props}>
    <g className="svg-stroke" stroke="#1A1323" strokeWidth={1.5}>
      <circle cx={8.453} cy={4.733} r={2.25} />
      <rect width={11.5} height={3.8} x={2.703} y={9.27} rx={1.9} />
    </g>
  </svg>
);
export default SvgComponent;
