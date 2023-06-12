import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_ENDPOINT;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'content-type': 'application/json' },
});

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
const post = function (url: string, data: any): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
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
      .post(url, data)
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
