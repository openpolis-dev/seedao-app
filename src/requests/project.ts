// Project Module API
import request from './http';
import { IBaseProject } from 'type/project.type';

const PATH_PREFIX = '/projects/';

export const createProjects = (data: IBaseProject) => {
  return request.post(PATH_PREFIX, data);
};

export const getProjects = (data: IPageParams) => {
  return request.get(`${PATH_PREFIX}?status=open&page=1&size=10&sort_field=created_at&sort_order=desc`);
};

export const getProjectById = (projectId: string) => {
  return request.get(PATH_PREFIX, { id: projectId });
};
