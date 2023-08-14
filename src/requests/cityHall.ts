import request from './http';
import { IUpdateStaffsParams } from 'requests/guild';

const PATH_PREFIX = '/cityhall';

export const getCityHallDetail = () => {
  return request.get(`${PATH_PREFIX}/info`);
};

export const updateMembers = (projectId: string, data: IUpdateStaffsParams) => {
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
