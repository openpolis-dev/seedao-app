import axios from 'axios';
import { SEEDAO_USER } from 'utils/constant';
import { parseToken } from 'utils/auth';
import { isMobile } from 'utils/userAgent';
import request, { ResponseData } from './http';
import { IPush } from 'type/push.type';

const TEMP_ENDPPOINT = 'https://test-push-api.seedao.tech/v1';
const PATH_PREFIX = '/push/';

type deviceType = 'pc' | 'mobile';

interface IRegisterDeviceParams {
  device: deviceType;
  registration_token: string;
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

interface ICreatePushParams {
  title: string;
  content: string;
  jump_url: string;
}

export const createPush = (data: ICreatePushParams) => {
  return request.post(PATH_PREFIX, data);
};

export const getPushList = (data: IPageParams): Promise<ResponseData<IPageResponse<IPush>>> => {
  return request.get(PATH_PREFIX, data);
};
