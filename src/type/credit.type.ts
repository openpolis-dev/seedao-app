export enum CreditRecordStatus {
  OVERDUE = 1,
  CLEAR,
  INUSE,
}

export interface ICreditRecord {
  status: CreditRecordStatus;
  // amount: string;
  // forfeit: string;
  // hash: string;
  // borrowTime: string;
  // lastRepaymentTime: string;
}
