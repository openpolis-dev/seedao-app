import { SEEDAO_USER, SEEDAO_USER_DATA, SELECT_WALLET, SENDING_ME_USER } from './constant';
import { ITokenType } from 'type/user.type';

export const clearStorage = () => {
  localStorage.removeItem(SEEDAO_USER);
  localStorage.removeItem(SENDING_ME_USER);
  localStorage.removeItem(SEEDAO_USER_DATA);
};

export const checkTokenValid = (token?: string, expireAt?: number) => {
  if (!token || !expireAt) {
    return;
  }
  if (Date.now() < Number(expireAt)) {
    return true;
  }
};

export const parseToken = (tokenstr: string): ITokenType | undefined => {
  try {
    const data = JSON.parse(tokenstr) as ITokenType;
    return { ...data };
  } catch (error) {}
  return;
};
