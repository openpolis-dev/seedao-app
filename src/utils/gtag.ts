function getGaId() {
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENV === 'test') {
    return 'G-TLV0DRYC92';
  }
  return 'G-QPVKNX8BXZ';
}

export const GA_TRACKING_ID = getGaId();

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
