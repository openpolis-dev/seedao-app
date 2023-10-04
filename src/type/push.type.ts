export enum PUSH_STATUS {
  WAITING = 1,
  SENDED,
  CANCELED,
}

export interface IPush {
  title: string;
  content: string;
  isTimer?: boolean;
  time: number;
  href: string;
  status: PUSH_STATUS;
  creator: string;
}

export interface IPushDisplay extends IPush {
  timeDisplay: string;
}
