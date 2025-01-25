// Public Data API
import request, { ResponseData } from './http';

const PATH_PREFIX = '/public_data';

export const publicList = (data: any) => {
  return request.get(`${PATH_PREFIX}/notion/database/73d83a0a-258d-4ac5-afa5-7a997114755a`, data);
};
export const pubDetail = (id: string) => {
  return request.get(`${PATH_PREFIX}/notion/page/${id}`);
};

export interface IVaultBalance {
  chainId: number;
  wallet: string;
  fiatTotal: string;
  threshold: number;
  owners: number;
}

export const getVaultBalance = (): Promise<ResponseData<{ wallets: IVaultBalance[] }>> => {
  return request.get(`${PATH_PREFIX}/safe_vault`);
};

export const getNodeSBT = () => {
  return request.get(`${PATH_PREFIX}/node_sbt_count`);
};
