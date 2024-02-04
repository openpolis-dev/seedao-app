import dayjs from 'dayjs';

export const getUTC = () => {
  const offset = dayjs().utcOffset();
  return `UTC+${offset / 60}`;
};

export const formatTime = (time: number, formatter?: '-' | '.') => {
  if (!time) return '';
  const f = formatter || '-';

  return dayjs(time).format(`YYYY${f}MM${f}DD HH:mm`);
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

export const formatMsgTime = (time: string | number, t: Function) => {
  const currentTime = new Date();
  const currentTimestamp = Math.floor(currentTime.getTime() / 1000);

  const targetTime = new Date(time);
  const oldTimestamp = Math.floor(targetTime.getTime() / 1000);

  // year
  const oldY = targetTime.getFullYear();
  // month
  const oldM = targetTime.getMonth() + 1;
  // day
  const oldD = targetTime.getDate();
  // hour
  const oldH = targetTime.getHours();
  // minute
  const oldi = targetTime.getMinutes();

  // delta sconds
  const timestampDiff = currentTimestamp - oldTimestamp;
  if (timestampDiff < 60) {
    // in one minute
    return t('general.JustNow');
  }

  if (timestampDiff < 60 * 60) {
    // in an hour
    return t('general.MinutesAgo', { time: Math.floor(timestampDiff / 60) });
  }

  // today
  if (oldY === currentTime.getFullYear() && oldM === currentTime.getMonth() + 1 && oldD === currentTime.getDate()) {
    // hh:mm
    return `${zeroize(oldH)}:${zeroize(oldi)}`;
  }

  // yesterday and older
  return formatTime(targetTime.getTime());

  // add "0"
  function zeroize(num: number) {
    return num < 10 ? '0' + num : num;
  }
};

export const formatDeltaDate = (endTime: number, formatDay = true) => {
  const now = Date.now();
  const until = endTime;
  const days = Math.abs(until - now) / 1000 / 3600 / 24;
  const day = Math.floor(days);
  const hours = (days - day) * 24;
  const hour = Math.floor(hours);
  const minutes = (hours - hour) * 60;
  let minute = Math.floor(minutes);
  const seconds = (minutes - minute) * 60;
  if (!hour && !day && seconds) {
    minute += 1;
  }
  return formatDay ? { d: day, h: hour, m: minute } : { h: hour, m: minute };
};
