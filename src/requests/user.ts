// Project Module API
import request, { API_VERSION, BASE_URL, ResponseData } from './http';
import { IUser, IUserInfo } from 'type/user.type';

const PATH_PREFIX = '/user';

type LoginParams = {
  wallet: string;
  timestamp: number;
  sign: string;
};

interface ILogininRespons {
  token: string;
  token_exp: number;
  user: IUser & IUserInfo;
}

export const login = (data: LoginParams): Promise<ResponseData<ILogininRespons>> => {
  return request.post(`${PATH_PREFIX}/login`, data);
};

export const logout = () => {
  return request.post(`${PATH_PREFIX}/logout`);
};

export const getUser = (): Promise<ResponseData<IUserInfo & { id: string }>> => {
  return request.get(`${PATH_PREFIX}/me`);
};

export const updateUser = (data: IUserInfo) => {
  return request.post(`${PATH_PREFIX}/me`, data);
};

export const getUsers = (wallets: string[]): Promise<ResponseData<IUser[]>> => {
  return request.get(`${PATH_PREFIX}/users`, { wallets });
};

export const readPermissionUrl = `${BASE_URL}/${API_VERSION}${PATH_PREFIX}/casbin`;
