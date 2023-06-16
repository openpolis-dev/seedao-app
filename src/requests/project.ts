// Project Module API
import request from './http';
import { IBaseProject } from 'type/project.type';

const PATH_PREFIX = '/projects/';

export const createProjects = (data: IBaseProject) => {
  return request.post(PATH_PREFIX, data);
};

export const getProjects = (data: IPageParams) => {
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
