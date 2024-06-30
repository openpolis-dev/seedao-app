import getConfig from 'utils/envCofnig';
import { CreditRecordStatus, ICreditRecord, RawCreditRecord } from 'type/credit.type';
import { formatTimeWithUTC } from 'utils/time';

const PATH_PREFIX = `${getConfig().INDEXER_ENDPOINT}/score_lend`;

export type VaultData = {
  totalBorrowed: number;
  totalBorrowedAmount: number;
  inUseCount: number;
  inUseAmount: number;
  paybackCount: number;
  paybackAmount: number;
  overdueCount: number;
  overdueAmount: number;
  forfeitSCRAmount: number;
};

export const getVaultData = (): Promise<VaultData> => {
  return fetch(`${PATH_PREFIX}/total_borrow`).then((res) => res.json());
};

export interface IFilterParams {
  debtor?: string;
  lendStatus?: CreditRecordStatus;
  sortField?: 'borrowAmount' | 'borrowTimestamp';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

type IListResponse = {
  page: number;
  total: number;
  data: ICreditRecord[];
};
export const getBorrowList = (data: IFilterParams): Promise<IListResponse> => {
  const queryData = new URLSearchParams(data as any);
  return fetch(`${PATH_PREFIX}/lends?${queryData.toString()}`)
    .then((res) => res.json())
    .then((res) => {
      console.log('=== getBorrowList ===', queryData.toString(), res);
      return {
        ...res,
        data: res.data.map((item: RawCreditRecord) => ({
          lendId: item.lendId,
          lendIdDisplay: String(8800000 + Number(item.lendId)),
          status: item.lendStatus,
          debtor: item.debtor,
          borrowAmount: Number(item.borrowAmount),
          borrowTime: formatTimeWithUTC(item.borrowTimestamp),
          borrowTx: item.borrowTx,
          rate: `${Number(item.interestRate) * 100}`,
          interestDays: item.interestDays,
          interestAmount: Number(item.interestAmount),
          paybackTime: formatTimeWithUTC(item.paybackTimestamp),
          paybackTx: item.paybackTx,
          overdueTime: formatTimeWithUTC(item.overdueTimestamp),
          mortgageSCRAmount: Number(item.mortgageSCRAmount),
        })),
      };
    });
};
