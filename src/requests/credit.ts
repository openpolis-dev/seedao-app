import getConfig from 'utils/envCofnig';
import { CreditRecordStatus, ICreditRecord, RawCreditRecord } from 'type/credit.type';
import { formatTime, getUTC } from 'utils/time';

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

interface IFilterParams {
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
      return {
        ...res,
        data: res.data.map((item: RawCreditRecord) => ({
          lendId: item.lendId,
          lendIdDisplay: String(88000 + Number(item.lendId)),
          status: item.lendStatus,
          debtor: item.debtor,
          borrowAmount: Number(item.borrowAmount),
          borrowTime: formatTime(item.borrowTimestamp * 1000) + ' ' + getUTC(),
          borrowTx: item.borrowTx,
          rate: `${Number(item.interestRate) * 100}`,
          interestDays: item.interestDays,
          interestAmount: Number(item.interestAmount),
          paybackTime: formatTime(item.paybackTimestamp * 1000) + ' ' + getUTC(),
          paybackTx: item.paybackTx,
          overdueTime: formatTime(item.overdueTimestamp * 1000) + ' ' + getUTC(),
          mortgageSCRAmount: Number(item.mortgageSCRAmount),
        })),
      };
    });
};
