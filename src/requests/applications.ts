// City Hall Module API
import request, { ResponseData } from './http';
import { ApplicationType, IApplication } from 'type/application.type';

const PATH_PREFIX = '/applications/';

export const getProjectApplications = (
  data: IPageParams,
  project_id = '',
): Promise<ResponseData<IPageResponse<IApplication>>> => {
  return request.get(`${PATH_PREFIX}`, {
    ...data,
    type: ApplicationType.NewReward,
    entity: 'project',
    entity_id: project_id,
  });
};

export const getCloseProjectApplications = (data: IPageParams, project_id = '') => {
  return request.get(`${PATH_PREFIX}`, {
    ...data,
    type: ApplicationType.CloseProject,
    entity: 'project',
    entity_id: project_id,
  });
};

export const createCloseProjectApplication = (project_id: number, detailed_type = '', comment = '') => {
  return request.post(`${PATH_PREFIX}`, [
    {
      type: ApplicationType.CloseProject,
      entity: 'project',
      entity_id: project_id,
      detailed_type,
      comment,
    },
  ]);
};

export interface ICreateBudgeApplicationRequest {
  type: ApplicationType;
  entity: 'project';
  entity_id: number;
  credit_amount: number;
  token_amount: number;
  detailed_type: string;
  comment: string;
}

export const createBudgetApplications = (data: ICreateBudgeApplicationRequest[]) => {
  return request.post(`${PATH_PREFIX}`, data);
};

// approve
export const approveApplications = (application_ids: number[]) => {
  return request.post(`${PATH_PREFIX}approve`, application_ids);
};
export const approveApplicationByID = (application_id: number) => {
  return request.post(`${PATH_PREFIX}${application_id}/approve`);
};

// reject
export const rejectApplications = (application_ids: number[]) => {
  return request.post(`${PATH_PREFIX}reject`, application_ids);
};
export const rejectApplicationByID = (application_id: number) => {
  return request.post(`${PATH_PREFIX}${application_id}/reject`);
};

// complete
export const compeleteApplications = (msg: string) => {
  return request.post(`${PATH_PREFIX}complete`, {
    message: msg,
  });
};

// download
export const getTemplateFile = () => {
  return request.post(`${PATH_PREFIX}download`, []);
};
