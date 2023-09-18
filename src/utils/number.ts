export const formatNumber = (num: number) => {
  return (num > 0 ? '' : '-') + Math.abs(num).toLocaleString('en-US');
};
