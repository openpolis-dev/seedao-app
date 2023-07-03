import React from 'react';

export default function InputNumber(
  props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
) {
  return <input type="number" onWheel={(e) => (e.target as any).blur()} {...props} />;
}
