import { useCallback } from 'react';
import EN from 'i18n/en.json';
import ZH from '../i18n/zh.json';
import { useAuthContext } from 'providers/authProvider';

type JSONValue = string | { [x: string]: JSONValue };

type I18nStoreType = { [x: string]: JSONValue };

const LANGUAGE_PACKAGES: { [key: string]: I18nStoreType } = {
  en: EN,
  zh: ZH,
};

const useTranslation = () => {
  const {
    state: { language },
  } = useAuthContext();

  const jsonFun = useCallback(
    (key: string, params = {}) => {
      if (!key || !language) {
        return key;
      }
      const strArr = key.split('.');
      let value: any = LANGUAGE_PACKAGES[language as string];
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
    [language],
  );
  return {
    t: jsonFun,
  };
};

export default useTranslation;
