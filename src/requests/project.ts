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
  return request.get(`${PATH_PREFIX}my`, data);
};

export const getProjectById = (projectId: string) => {
  return request.get(`${PATH_PREFIX}${projectId}`);
};
export const closeProjectById = (projectId: string) => {
  return request.post(`${PATH_PREFIX}${projectId}/close`);
};
export const UpdateBudget = (projectId: string, data: BudgetObj) => {
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

export const addRelatedProposal = (projectId: string, proposalId: string) => {
  return request.post(`${PATH_PREFIX}${projectId}/add_related_proposal/${proposalId}`);
};
