// Project Module API
import request from './http';

const PATH_PREFIX = '/projects';

export const getProjects = (data: IPageParams) => {
  return request.get(PATH_PREFIX, data);
};

export const getProjectById = (projectId: string) => {
  return request.get(PATH_PREFIX, { id: projectId });
};
