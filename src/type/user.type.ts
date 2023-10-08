export interface IUser {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  wallet?: string;
  discord_profile: string;
  twitter_profile: string;
  wechat: string;
  mirror: string;
  assets: any[];
}

export interface IUserInfo {
  name: string;
  avatar: string;
  email: string;
  discord_profile: string;
  twitter_profile: string;
  wechat: string;
  mirror: string;
}

export interface ITokenType {
  token: string;
  token_exp: number;
}

export type Asset = {
  dealt_amount: number;
  processing_amount: number;
  total_amount: number;
};
