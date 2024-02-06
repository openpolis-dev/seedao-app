// Guild Module API
import request, { ResponseData } from './http';
import { IBaseProject, InfoObj, ReTurnProject, IProject, IGuild } from 'type/project.type';

const PATH_PREFIX = '/guilds/';

export const createProjects = (data: IBaseProject) => {
  return request.post(PATH_PREFIX, data);
};

export const createNewGuild = (data: IGuild) => {
  return request.post(PATH_PREFIX, data);
};

export const getProjects = (data: IPageParams): Promise<ResponseData<IPageResponse<ReTurnProject>>> => {
  return request.get(PATH_PREFIX, data);
};
export const getMyProjects = (data: IPageParams) => {
  return request.get(`/my_guilds`, data);
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
export type UpdateGuildParamsType = {
  ContantWay: string;
  OfficialLink: string;
  desc: string;
  logo: string;
  name: string;
  sponsors: [string];
};
export const updateGuildInfo = (guildId: number, data: UpdateGuildParamsType) => {
  return request.put(`${PATH_PREFIX}${guildId}`, data);
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

export const closeGuild = (guildId: number | string) => {
  return request.post(`${PATH_PREFIX}${guildId}/close`);
};
