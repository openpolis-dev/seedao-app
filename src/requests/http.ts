import axios from 'axios';
import { SEEDAO_USER } from 'utils/constant';
import { parseToken, checkTokenValid, clearStorage } from 'utils/auth';
import getConfig from 'utils/envCofnig';

export const BASE_URL = getConfig().REACT_APP_BASE_ENDPOINT;

export const API_VERSION = process.env.REACT_APP_API_VERSION;

const instance = axios.create({
  baseURL: `${BASE_URL}/${API_VERSION}`,
  timeout: 15000,
  headers: { 'content-type': 'application/json' },
});

export const getBaseURL = instance.getUri;

instance.interceptors.request.use(
  (config: any) => {
    const method = config.method?.toLowerCase();
    if (
      !['post', 'put', 'delete'].includes(method) &&
      !config.url.includes('my') &&
      !config.url.includes('user') &&
      !config.url.includes('push') &&
      !config.url.includes('app_bundles')
    ) {
      return config;
    }
    const tokenstr = localStorage.getItem(SEEDAO_USER);
    if (!tokenstr) {
      return config;
    }

    const tokenData = parseToken(tokenstr);
    if (!checkTokenValid(tokenData?.token, tokenData?.token_exp)) {
      clearStorage();
      return Promise.reject('token is expired!');
    }

    if (!config.headers) {
      config.headers = {};
    }
    config.headers['Authorization'] = `Bearer ${tokenData?.token || ''}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export interface ResponseData<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * get
 * @method get
 * @param {url, params, loading}
 */
const get = function (url: string, params: any = {}): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    instance
      .get(url, { params })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
/**
 * post
 * @method post
 * @param {url, params}
 */
const post = function (url: string, data: any = {}): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err?.response);
      });
  });
};

/**
 * put
 * @method put
 * @param {url, params}
 */
const put = function (url: string, data: any): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    instance
      .put(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const rdelete = function (url: string, params: any): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, {
        params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default { get, post, put, delete: rdelete };
