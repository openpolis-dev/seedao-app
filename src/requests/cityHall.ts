import request from './http';
import { IUpdateStaffsParams } from 'requests/guild';

const PATH_PREFIX = '/cityhall';

export const getCityHallDetail = () => {
  return request.get(`${PATH_PREFIX}/info`);
};

export interface MemberObj {
  add?: string[];
  remove?: string[];
}
export const updateMembers = (data: MemberObj) => {
  return request.post(`${PATH_PREFIX}/update_members`, data);
};

export interface IUpdateBudgetParams {
  asset_name: string;
  total_amount: number;
  asset_type: string;
}

export const UpdateBudget = (data: IUpdateBudgetParams) => {
  return request.post(`${PATH_PREFIX}/update_budget`, data);
};

export const getGovernanceNodeResult = () => {
  return request.get('data_srv/aggr_scr');
};
