export interface IUser {
  id: string;
  name: string;
  avatar: string;
  email: string;

  discord_profile: string;
  twitter_profile: string;
  google_profile: string;
}

export interface IUserInfo {
  name: string;
  avatar: string;
  email: string;
  discord_profile: string;
  twitter_profile: string;
  google_profile: string;
}

export interface ITokenType {
  token: string;
  token_exp: number;
}
