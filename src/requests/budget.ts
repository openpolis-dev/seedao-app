// Budget Module API
import request, { ResponseData } from './http';
import { ReturnBudget } from 'type/project.type';

const PATH_PREFIX = '/common_budget_sources/';

export interface IBudgetPageParams extends IPageParams {
  keywords?: string;
  wallet?: string;
}

export const getBudgetSources = (
  data: IBudgetPageParams,
  show_special = true,
): Promise<ResponseData<IPageResponse<ReturnBudget>>> => {
  return request.get(`${PATH_PREFIX}`, data);
};
