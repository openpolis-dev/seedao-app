import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n/i18n';
import 'utils/tracing';
import { isMobile, isPhone } from 'utils/userAgent';
import getConfig from 'utils/envCofnig';
import { unregister, register } from 'utils/serviceWorkerRegistration';

const config = getConfig();
const isLargeScreen = window.innerWidth >= 768;

if (config.REACT_APP_MOBILE_OPEN && (isPhone || (isMobile && !isLargeScreen))) {
  const isSnsPath = window.location.href.includes('/sns');
  const mobile_app = config.REACT_APP_MOBILE_URL + (isSnsPath ? `/sns${window.location.search}` : '');
  mobile_app && window.location.replace(mobile_app);
} else {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(<App />);

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
  unregister(register);
}
