import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <g className="svg-stroke" stroke="#1A1323" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.75 9.494v2.775c0 2.34-2.182 4.238-4.875 4.238C3.183 16.507 1 14.609 1 12.269V9.494c0 2.34 2.183 4.013 4.875 4.013 2.693 0 4.875-1.673 4.875-4.013Z" />
      <path d="M10.75 5.743c0 .683-.188 1.313-.518 1.853-.802 1.32-2.452 2.16-4.357 2.16-1.905 0-3.555-.84-4.357-2.16A3.528 3.528 0 0 1 1 5.743c0-1.17.547-2.227 1.425-2.992.885-.773 2.1-1.245 3.45-1.245s2.565.472 3.45 1.237c.878.773 1.425 1.83 1.425 3Z" />
      <path d="M10.75 5.743v3.75c0 2.34-2.182 4.013-4.875 4.013C3.183 13.506 1 11.833 1 9.493v-3.75c0-2.34 2.183-4.237 4.875-4.237 1.35 0 2.565.472 3.45 1.237.878.773 1.425 1.83 1.425 3Z" />
    </g>
  </svg>
);
export default SvgComponent;
