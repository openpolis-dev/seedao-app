export enum PUSH_STATUS {
  WAITING = 1,
  SENDED,
  CANCELED,
}

export interface IPush {
  id: string;
  title: string;
  content: string;
  jump_url: string;
  creator_wallet: string;
  push_date: string;
  created_at: string;
  // status: PUSH_STATUS;
  isTimer?: boolean;
}

export interface IPushDisplay extends IPush {
  timeDisplay: string;
}
