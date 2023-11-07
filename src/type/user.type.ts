export interface IUser {
  id: string;
  name?: string;
  nickname?: string | undefined;
  bio: string;
  avatar: string;
  email?: string;
  github?: string;
  created_at?: string;
  updated_at?: string;
  wallet?: string;
  discord_profile: string;
  twitter_profile: string;
  wechat: string;
  mirror: string;
  assets: any[];
  level?: any;
  scr?: any;
  social_accounts?: any;
  sbt?: any;
  seed?: any;
  roles?: string[];
}

export interface IUserInfo {
  name: string;
  bio: string;
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

export enum UserRole {
  None = 0,
  Admin,
  Member,
}
