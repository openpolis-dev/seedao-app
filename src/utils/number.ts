export const formatNumber = (num: number) => {
  return (num >= 0 ? '' : '-') + Math.abs(num).toLocaleString('en-US');
};

export const getShortDisplay = (v: any, num?: number) => {
  if (!v) return v;
  let value: string;
  if (typeof v === 'number') {
    value = String(v);
  } else {
    value = v;
  }
  const arr = value.split('.');
  let res = arr[0];
  if (arr[1]) {
    res += `.${arr[1].slice(0, num || 6)}`;
  }
  return res;
};
