import { SEEDAO_USER } from './constant';

export type TokenType = {
  token: string;
  token_exp: number;
};

export const clearStorage = () => {
  localStorage.removeItem(SEEDAO_USER);
};

export const checkTokenValid = (token?: string, expireAt?: number) => {
  if (!token || !expireAt) {
    return;
  }
  if (Date.now() < Number(expireAt)) {
    return true;
  }
};

export const parseToken = (tokenstr: string): TokenType | undefined => {
  try {
    const data = JSON.parse(tokenstr) as TokenType;
    return { ...data };
  } catch (error) {}
  return;
};
