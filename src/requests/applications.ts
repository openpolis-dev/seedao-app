// City Hall Module API
import request, { ResponseData, getBaseURL } from './http';
import { ApplicationStatus, ApplicationType, IApplication } from 'type/application.type';

const PATH_PREFIX = '/applications/';

export interface IQueryApplicationsParams {
  start_date?: string;
  end_date?: string;
  applicant?: string;
  user_wallet?: string;
  state?: ApplicationStatus;
}

export const getProjectApplications = (
  data: IPageParams,
  queryData: IQueryApplicationsParams,
  project_id?: number,
): Promise<ResponseData<IPageResponse<IApplication>>> => {
  return request.get(`${PATH_PREFIX}`, {
    ...data,
    type: ApplicationType.NewReward,
    entity: 'project',
    entity_id: project_id,
    ...queryData,
  });
};

export const getCloseProjectApplications = (
  data: IPageParams,
  queryData: IQueryApplicationsParams,
): Promise<ResponseData<IPageResponse<IApplication>>> => {
  return request.get(`${PATH_PREFIX}`, {
    ...data,
    type: ApplicationType.CloseProject,
    entity: 'project',
    ...queryData,
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
  target_user_wallet: string;
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
export const compeleteApplications = (data: string[]) => {
  return request.post(`${PATH_PREFIX}complete`, {
    message: data,
  });
};
// process
export const processApplications = (data: number[]) => {
  return request.post(`${PATH_PREFIX}process`, {
    message: data,
  });
};

// download
export const getTemplateFileUrl = () => {
  return `${getBaseURL()}${PATH_PREFIX}get_upload_template`;
};
export const getTemplateFile = () => {
  return request.post(`${PATH_PREFIX}download`, []);
};

interface IApplicantRequest {
  entity: 'project' | 'guild';
  entity_id: number;
}

interface IApplicant {
  applicant: string;
  name: string;
}

// applicants
export const getApplicants = (data?: IApplicantRequest): Promise<ResponseData<IApplicant[]>> => {
  return request.get(`${PATH_PREFIX}applicants`, data);
};
