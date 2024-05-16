import getConfig from 'utils/envCofnig';
import { ResponseData } from './http';

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
