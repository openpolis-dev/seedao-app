import axios from 'axios';
import { SEEDAO_USER } from 'utils/constant';
import { parseToken } from 'utils/auth';
import { isMobile } from 'utils/userAgent';

const TEMP_ENDPPOINT = 'https://test-push-api.seedao.tech/v1';
const PATH_PREFIX = '/push';

type deviceType = 'pc' | 'mobile';

interface IRegisterDeviceParams {
  device: deviceType;
  push_subscription: PushSubscriptionJSON;
  wallet: string;
  language: string;
}

const getHeaders = () => {
  const tokenstr = localStorage.getItem(SEEDAO_USER);
  if (!tokenstr) {
    return;
  }
  const tokenData = parseToken(tokenstr);
  return {
    Authorization: `Bearer ${tokenData?.token || ''}`,
  };
};

export const registerDevice = (data: IRegisterDeviceParams) => {
  const headers = getHeaders();
  axios.post(`${TEMP_ENDPPOINT}/register`, data, {
    headers,
  });
};

interface ISetDeviceLanguage {
  device: deviceType;
  language: string;
}

export const requestSetDeviceLanguage = (data: ISetDeviceLanguage) => {
  const headers = getHeaders();
  return axios.post(`${TEMP_ENDPPOINT}/set_language`, data, {
    headers,
  });
};

export const getPushDevice = () => {
  return isMobile ? 'mobile' : 'pc';
};
