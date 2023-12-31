import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isNotOnline } from 'utils';

export const GA_TRACKING_ID = isNotOnline() ? 'G-TLV0DRYC92' : 'G-QPVKNX8BXZ';

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
