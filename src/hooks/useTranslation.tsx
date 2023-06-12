import { useRouter } from 'next/router';
import { useCallback } from 'react';
import EN from 'i18n/en.json';
import ZH from '../i18n/zh.json';

type JSONValue = string | { [x: string]: JSONValue };

type I18nStoreType = { [x: string]: JSONValue };

const LANGUAGE_PACKAGES: { [key: string]: I18nStoreType } = {
  en: EN,
  zh: ZH,
};

const useTranslation = () => {
  const { locale } = useRouter();

  const jsonFun = useCallback(
    (key: string, params = {}) => {
      if (!key || !locale) {
        return key;
      }
      let strArr = key.split('.');
      let value = LANGUAGE_PACKAGES[locale];
      strArr.map((item) => {
        value = value[item];
      });
      // let value = LANGUAGE_PACKAGES[locale][key];
      console.log('~', LANGUAGE_PACKAGES[locale]);

      console.log('~key', key);
      console.log('~value', value);
      if (!value || typeof value !== 'string') {
        return key;
      }
      Object.keys(params).forEach((item) => {
        value = (value as string).replace(new RegExp(`{${item}}`, 'g'), params[item]);
      });
      return value;
    },
    [locale],
  );
  return {
    t: jsonFun,
  };
};

export default useTranslation;
