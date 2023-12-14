import request, { ResponseData } from './http';
import { ISeason } from 'type/application.type';

const PATH_PREFIX = '/cityhall';

export enum MemberGroupType {
  Governance = 'G_GOVERNANCE',
  Brand = 'G_BRANDING',
  Tech = 'G_TECH',
}

interface ICityHallResponse {
  id: number;
  grouped_sponsors: { [k: string]: string[] };
}

export const getCityHallDetail = (): Promise<ResponseData<ICityHallResponse>> => {
  return request.get(`${PATH_PREFIX}/info`);
};

interface IUpdateMemberParams {
  add?: string[];
  remove?: string[];
  group_name?: MemberGroupType;
}

export const updateMembers = (data: IUpdateMemberParams) => {
  return request.post(`${PATH_PREFIX}/update_members`, data);
};

export const batchUpdateMembers = (data: IUpdateMemberParams[]) => {
  return request.post(`${PATH_PREFIX}/batch_update_members`, data);
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

// snapshot
export const requestSnapshotSeed = () => {
  return request.post('rewards/snapshot_seed');
};
// send reward
export const requestApproveMintReward = () => {
  return request.post('rewards/approve_mint_reward');
};

export const getCurrentSeason = (): Promise<ResponseData<ISeason>> => {
  return request.get(`/seasons/current`);
};
