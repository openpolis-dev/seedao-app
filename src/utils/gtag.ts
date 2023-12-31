import { isNotOnline } from './index';

export const GA_TRACKING_ID = isNotOnline() ? 'G-TLV0DRYC92' : 'G-QPVKNX8BXZ';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (path: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: path,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
type EventParams = {
  action: string;
  category: string;
  label?: string;
  value?: any;
};
export const event = ({ action, category, label, value }: EventParams) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export enum EVENTS {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
}
