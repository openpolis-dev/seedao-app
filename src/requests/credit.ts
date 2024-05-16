import getConfig from 'utils/envCofnig';
import { CreditRecordStatus, RowCreditRecord } from 'type/credit.type';

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
    data: RowCreditRecord[];
}
export const getBorrowList = (data: IFilterParams): Promise<IListResponse> => {
  const queryData = new URLSearchParams(data as any);
  return fetch(`${PATH_PREFIX}/lends?${queryData.toString()}`).then((res) => res.json());
};
