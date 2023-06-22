import dayjs from 'dayjs';

export const getUTC = () => {
  const offset = dayjs().utcOffset();
  return `UTC+${offset / 60}`;
};

export const formatTime = (time: number, formatter?: '-' | '.') => {
  if (formatter === '-') {
    return dayjs(time).format('YYYY-MM-DD HH:mm');
  }
  return dayjs(time).format('YYYY.MM.DD HH:mm');
};

export const formatLeftTime = (targetTime: number) => {
  const now = Date.now();
  const leftTime = targetTime - now;
  if (leftTime <= 0) {
    return 0;
  }
  const days = Math.floor(leftTime / 86400000);
  const left = leftTime % 86400;
  return days + (left > 0 ? 1 : 0);
};

export const formatDate = (date: Date, formatter?: '-' | '.') => {
  return dayjs(date).format(['YYYY', 'MM', 'DD'].join(formatter || '-'));
};
