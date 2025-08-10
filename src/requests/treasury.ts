// Assets Module API
import { BudgetType } from 'type/project.type';
import request, { ResponseData } from './http';

const PATH_PREFIX = '/treasury';

interface ITreasuryResponse {
  id: number;
  quarter_num: number;
  credit_total_amount: number;
  credit_used_amount: number;
  token_total_amount: number;
  token_used_amount: number;
  see_used_amount?: number;
  see_total_amount?: number;
}

export const getTreasury = (): Promise<ResponseData<ITreasuryResponse>> => {
  return request.get(`${PATH_PREFIX}/current`);
};

export const updateTokenBudget = (amount: number) => {
  return request.post(`${PATH_PREFIX}/update_assets`, [
    { total_amount: amount, asset_name: 'USDC', budget_type: BudgetType.Token },
  ]);
};

export const updateBudget = (amount: number, type: BudgetType, asset_name: 'USDC' | 'SCR'|'ETH') => {
  return request.post(`${PATH_PREFIX}/update_assets`, [
    { total_amount: amount, asset_name: asset_name, budget_type: type },
  ]);
};
