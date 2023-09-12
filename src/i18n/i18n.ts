import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import zh from './locales/zh.json';

export const resources = {
  en: { translation: en },
  zh: { translation: zh },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  resources,
  fallbackLng: 'en', // default lang
  debug: true,
});

export default i18n;
