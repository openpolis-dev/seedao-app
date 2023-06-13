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
  const { query } = useRouter();

  const jsonFun = useCallback(
    (key: string, params = {}) => {
      if (!key || !query.lang) {
        return key;
      }
      const strArr = key.split('.');
      let value: any = LANGUAGE_PACKAGES[query.lang as string];
      strArr.map((item) => {
        value = value[item];
      });
      if (!value || typeof value !== 'string') {
        return key;
      }
      Object.keys(params).forEach((item) => {
        value = (value as string).replace(new RegExp(`{${item}}`, 'g'), params[item]);
      });
      return value;
    },
    [query.lang],
  );
  return {
    t: jsonFun,
  };
};

export default useTranslation;
