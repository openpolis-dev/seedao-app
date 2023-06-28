// Project Module API
import request, { ResponseData } from './http';
import { BudgetObj, IBaseProject, InfoObj, ReTurnProject } from 'type/project.type';

const PATH_PREFIX = '/projects/';

export const createProjects = (data: IBaseProject) => {
  return request.post(PATH_PREFIX, data);
};

export const getProjects = (data: IPageParams): Promise<ResponseData<IPageResponse<ReTurnProject>>> => {
  return request.get(PATH_PREFIX, data);
};
export const getMyProjects = (data: IPageParams) => {
  return request.get(`/my_projects`, data);
};

export const getProjectById = (projectId: string) => {
  return request.get(`${PATH_PREFIX}${projectId}`);
};
export const closeProjectById = (projectId: string) => {
  return request.post(`${PATH_PREFIX}${projectId}/close`);
};

export interface IUpdateBudgetParams {
  id: number;
  asset_name: string;
  total_amount: number;
}
export const UpdateBudget = (projectId: string, data: IUpdateBudgetParams) => {
  return request.post(`${PATH_PREFIX}${projectId}/update_budget`, data);
};
export const UpdateInfo = (projectId: string, data: InfoObj) => {
  return request.put(`${PATH_PREFIX}${projectId}`, data);
};
export const updateMembers = (projectId: string, data: any) => {
  return request.post(`${PATH_PREFIX}${projectId}/update_members`, data);
};
export const updateSponsors = (projectId: string, data: any) => {
  return request.post(`${PATH_PREFIX}${projectId}/update_sponsors`, data);
};

export const addRelatedProposal = (projectId: string, proposalIds: string[]) => {
  return request.post(
    `${PATH_PREFIX}${projectId}/add_related_proposal?${proposalIds.map((p) => `proposalIDs=${p}`).join('&')}`,
  );
};

export interface IUpdateStaffsParams {
  action: 'add' | 'remove';
  sponsors?: string[];
  members?: string[];
}

export const updateStaffs = (projectId: string, data: IUpdateStaffsParams) => {
  return request.post(`${PATH_PREFIX}${projectId}/update_staffs`, data);
};
