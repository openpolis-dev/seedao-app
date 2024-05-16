export enum CreditRecordStatus {
  INUSE,
  OVERDUE,
  CLEAR,
}

export interface RowCreditRecord {
  id: number;
  lendId: string;
  lendStatus: CreditRecordStatus;
  debtor: string;
  borrowToken: string; // 借款token地址，现在只支持 USDT
  borrowAmount: string; //借款数量 (不包含精度)
  mortgageSCRAmount: string; // 抵押 SCR 数量 (不包含精度)
  interestRate: string;
  borrowTimestamp: number;
  borrowTx: string;
  overdueTimestamp: number;
  paybackTimestamp: number;
  paybackTx: string;
  interestDays: number;
  interestAmount: string;
}

export interface ICreditRecord {
  lendId: string;
  lendIdDisplay: string;
  status: CreditRecordStatus;
  debtor: string;
  borrowAmount: number;
  borrowTime: string;
  borrowTx: string;
  rate: string;
  interestDays: number;
  interestAmount: number;
  paybackTime: string;
  paybackTx: string;
  overdueTime: string;
  mortgageSCRAmount: number;
}
