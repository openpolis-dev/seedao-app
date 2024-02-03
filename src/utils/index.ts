import { ApplicationStatus } from 'type/application.type';
import getConfig from './envCofnig';

export const formatApplicationStatus = (status: ApplicationStatus, isProj?: boolean): any => {
  if (isProj) {
    if (status === ApplicationStatus.Approved || status === ApplicationStatus.Completed) {
      return 'Project.Approved';
    }
  }
  switch (status) {
    case ApplicationStatus.Open:
      return 'Project.ToBeReviewed';
    case ApplicationStatus.Approved:
      return 'Project.ToBeIssued';
    case ApplicationStatus.Rejected:
      return 'Project.Rejected';
    case ApplicationStatus.Processing:
      return 'Project.Sending';
    case ApplicationStatus.Completed:
      return 'Project.Sended';
    default:
      return '';
  }
};

export const getProposalSIPSlug = (sip: number | undefined, suffix = ': ') => {
  if (!sip) return '';
  if (suffix) {
    return `SIP-${sip}${suffix}`;
  }
  return sip;
};
export const isNotOnline = () => {
  return process.env.REACT_APP_ENV_VERSION !== 'prod';
};

export const debounce = (fn: any, wait: number) => {
  let timer: any;
  return (...args: any) => {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(context, args);
    }, wait);
  };
};

const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const getRandomCode = () => {
  let str = '';
  for (let i = 0; i < 4; i++) {
    const ascii = getRandom(48, 122);
    if ((ascii > 57 && ascii < 65) || (ascii > 90 && ascii < 97)) {
      i--;
      continue;
    }
    const c = String.fromCharCode(ascii);
    str += c;
  }
  return str;
};
