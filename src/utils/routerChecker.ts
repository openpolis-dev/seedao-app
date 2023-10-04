import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
ReactGA.initialize('G-584K59B1LH');

export default function RouterChecker() {
  let location = useLocation();

  useEffect(() => {
    document.title = `SEEDAO - ${location.pathname.split('/')[1].toUpperCase()}`;
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location.pathname]);
  // ReactGA.event({
  return null;
}
