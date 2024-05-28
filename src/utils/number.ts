export const formatNumber = (num: number) => {
  const prefix = num >= 0 ? '' : '-';
  const numSplitStr = String(num).split('.');
  const intNum = Math.abs(Number(numSplitStr[0])).toLocaleString('en-US');
  return prefix + intNum + (numSplitStr.length > 1 ? `.${numSplitStr[1]}` : '');
};

// 展示num位小数，不足的补0，超出的截取
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
    const more = `.${arr[1].slice(0, num)}`;
    if (more.length < num + 1) {
      res += more + '0'.repeat(num + 1 - more.length);
    } else if (more.length === num + 1) {
      res += more;
    }
  } else if (num > 0) {
    res += '.' + '0'.repeat(num);
  }
  return res;
};

Number.prototype.format = function (n = 2) {
  return getShortDisplay(formatNumber(Number(this)), n);
};

// 有小数位的全部展示，否则按照n位展示
Number.prototype.format2 = function (n = 2) {
  const value = String(this).split('.');
  if (value[1]) {
    return `${formatNumber(Number(value[0]))}.${value[1]}`;
  } else {
    return `${value[0]}.${'0'.repeat(n)}`;
  }
};
