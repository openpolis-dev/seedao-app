// Project Module API
import axios from 'axios';
import request, { API_VERSION, BASE_URL, ResponseData } from './http';
import { IUser, IUserInfo } from 'type/user.type';
import { SeeAuth } from '@seedao/see-auth';

import getConfig from "../utils/envCofnig";
const envConfig = getConfig();
const  SBT_BASEURL= envConfig.SBT_BASEURL;

const PATH_PREFIX = '/user';

interface ILogininRespons {
  token: string;
  token_exp: number;
  user: IUser & IUserInfo;
}

export const getNonce = (wallet: string): Promise<ResponseData<{ nonce: string }>> => {
  return request.post(`${PATH_PREFIX}/refresh_nonce`, { wallet });
};

// =========== third party login with SeeAuth ===========

interface ILoginWithSeeAuthResponse extends ILogininRespons {
  see_auth: SeeAuth;
}
export const loginWithSeeAuth = (data: {
  domain: string;
  message: string;
  signature: string;
  wallet: string;
  walletName: string;
}): Promise<ResponseData<ILoginWithSeeAuthResponse>> => {
  return request.post('/seeauth/login', data);
};

export const login = (data: {
  wallet: string;
  message: string;
  signature: string;
  domain: string;
  wallet_type: 'EOA' | 'AA';
  is_eip191_prefix: boolean;
}): Promise<ResponseData<ILogininRespons>> => {
  return request.post(`${PATH_PREFIX}/login`, data);
};

export const logout = () => {
  return request.post(`${PATH_PREFIX}/logout`);
};

export const getUser = () => {
  return request.get(`${PATH_PREFIX}/me`);
};

export const updateUser = (data: IUserInfo) => {
  return request.put(`${PATH_PREFIX}/me`, data);
};

export const getUserLevel = () => {
  return request.get(`${PATH_PREFIX}/level`);
};


export const getUsers = (wallets: string[]): Promise<ResponseData<IUser[]>> => {
  const data: string[] = [];
  wallets.forEach((item) => {
    data.push(`wallets=${item}`);
  });
  return request.get(`${PATH_PREFIX}/users?${data.join('&')}`);
};

export const readPermissionUrl = `${BASE_URL}/${API_VERSION}${PATH_PREFIX}/casbin`;

interface IMetaforoResponse {
  token: string;
  wallet: string;
  user_id: number;
}

export const loginToMetafo = (data: SeeAuth): Promise<{ data: IMetaforoResponse }> => {
  return axios.post('https://stage.metaforo.io/api/seeAuth?api_key=1', data);
};

interface IDeschoolResponse {
  jwtToken: string;
  expire: string;
}

export const loginToDeschool = (data: SeeAuth): Promise<{ data: IDeschoolResponse }> => {
  return axios.post('https://deschool.app/api/login?app=seedao', data);
};


export const loginToSBT = (data: SeeAuth): Promise<{ data: IMetaforoResponse }> => {
  return axios.post(`${SBT_BASEURL}/user/seeAuth`, data);
};
