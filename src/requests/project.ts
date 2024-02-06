// Project Module API
import request, { ResponseData } from './http';
import { IBaseProject, InfoObj, ReTurnProject, IProject } from 'type/project.type';

const PATH_PREFIX = '/projects/';

// to be discarded
export const createProjects = (data: IBaseProject) => {
  return request.post(PATH_PREFIX, data);
};

export const createNewProject = (data: IProject) => {
  return request.post(PATH_PREFIX, data);
};

export const getProjects = (
  data: IPageParams,
  show_special = true,
): Promise<ResponseData<IPageResponse<ReTurnProject>>> => {
  return request.get(`${PATH_PREFIX}?show_special=${show_special}`, data);
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
export type UpdateProjectParamsType = {
  ContantWay: string;
  OfficialLink: string;
  OverLink: string;
  desc: string;
  logo: string;
  sponsors: string[];
};
export const updateProjectInfo = (projectId: number, data: UpdateProjectParamsType) => {
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
