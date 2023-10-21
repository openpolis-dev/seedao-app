import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n/i18n';
import * as serviceWorkerRegistration from 'utils/serviceWorkerRegistration';
import { isMobile, isPhone } from 'utils/userAgent';

const isLargeScreen = window.innerWidth >= 768;
if (process.env.REACT_APP_MOBILE_OPEN === 'true' && (isPhone || (isMobile && !isLargeScreen))) {
  const mobile_app = process.env.REACT_APP_MOBILE_URL;
  mobile_app && window.location.replace(mobile_app);
} else {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(<App />);

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
  serviceWorkerRegistration.register();
}
