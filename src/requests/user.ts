// Project Module API
import request, { API_VERSION, BASE_URL, ResponseData } from './http';
import { IUser, IUserInfo } from 'type/user.type';

const PATH_PREFIX = '/user';

interface ILogininRespons {
  token: string;
  token_exp: number;
  user: IUser & IUserInfo;
}

export const getNonce = (wallet: string): Promise<ResponseData<{ nonce: string }>> => {
  return request.post(`${PATH_PREFIX}/refresh_nonce`, { wallet });
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

export const getUser = (): Promise<ResponseData<IUser>> => {
  return request.get(`${PATH_PREFIX}/me`);
};

export const updateUser = (data: IUserInfo) => {
  return request.put(`${PATH_PREFIX}/me`, data);
};

export const getUsers = (wallets: string[]): Promise<ResponseData<IUser[]>> => {
  const data: string[] = [];
  wallets.forEach((item) => {
    data.push(`wallets=${item}`);
  });
  return request.get(`${PATH_PREFIX}/users?${data.join('&')}`);
};

export const readPermissionUrl = `${BASE_URL}/${API_VERSION}${PATH_PREFIX}/casbin`;
