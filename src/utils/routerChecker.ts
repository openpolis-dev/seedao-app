import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const isNotOnline = () => {
  return process.env.NODE_ENV === 'development';
};

export const GA_TRACKING_ID = isNotOnline() ? 'G-TLV0DRYC92' : 'G-584K59B1LH';

ReactGA.initialize(GA_TRACKING_ID);

export default function RouterChecker() {
  let location = useLocation();

  useEffect(() => {
    document.title = `SEEDAO - ${location.pathname.split('/')[1].toUpperCase()}`;
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location.pathname]);
  // ReactGA.event({
  return null;
}
