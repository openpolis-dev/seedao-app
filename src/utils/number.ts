export const formatNumber = (num: number) => {
  return (num >= 0 ? '' : '-') + Math.abs(num).toLocaleString('en-US');
};

export const getShortDisplay = (v: any, num = 2) => {
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
    const more = `.${arr[1].slice(0, num || 6)}`;
    res += more;
    if (more.length < num + 1) {
      res += '0'.repeat(num + 1 - more.length);
    }
  } else {
    res += '.00';
  }
  return res;
};

Number.prototype.format = function (n = 2) {
  return getShortDisplay(formatNumber(Number(this)), n);
};

Number.prototype.format2 = function (n = 2) {
  const value = String(this).split('.');
  if (value[1]) {
    console.log('???', formatNumber(Number(value[0])));
    return `${formatNumber(Number(value[0]))}.${value[1]}`;
  } else {
    return `${value[0]}.${'0'.repeat(n)}`;
  }
};
