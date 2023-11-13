// City Hall Module API
import request, { ResponseData, getBaseURL } from './http';
import {
  ApplicationStatus,
  ApplicationType,
  IApplication,
  IApplicantBundle,
  ApplicationEntity,
  ISeason,
} from 'type/application.type';
import { ReTurnProject } from 'type/project.type';
import { AssetName } from 'utils/constant';

const PATH_PREFIX = '/applications/';
const BUNDLE_PATH_PREFIX = '/app_bundles/';

export const getApplicationById = (application_id: number): Promise<ResponseData<IApplication>> => {
  return request.get(`${PATH_PREFIX}${application_id}`);
};

export interface IQueryApplicationsParams {
  start_date?: string;
  end_date?: string;
  applicant?: string;
  user_wallet?: string;
  state?: ApplicationStatus;
  season_id?: number;
}

export interface IQueryParams extends IQueryApplicationsParams {
  entity?: 'project' | 'guild';
  entity_id?: number;
}

export const getApplications = (
  data: IPageParams,
  queryData: IQueryParams,
): Promise<ResponseData<IPageResponse<IApplication>>> => {
  return request.get(`${PATH_PREFIX}`, {
    ...data,
    type: ApplicationType.NewReward,
    ...queryData,
  });
};

export const getProjectApplications = (
  data: IPageParams,
  queryData: IQueryApplicationsParams,
  project_id?: number,
): Promise<ResponseData<IPageResponse<IApplication>>> => {
  return request.get(`${PATH_PREFIX}`, {
    ...data,
    type: ApplicationType.NewReward,
    entity: project_id ? 'project' : '',
    entity_id: project_id,
    ...queryData,
  });
};

export const getGuildApplications = (
  data: IPageParams,
  queryData: IQueryApplicationsParams,
  guild_id?: number,
): Promise<ResponseData<IPageResponse<IApplication>>> => {
  return request.get(`${PATH_PREFIX}`, {
    ...data,
    type: ApplicationType.NewReward,
    entity: guild_id ? 'guild' : '',
    entity_id: guild_id,
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
  entity: 'project' | 'guild';
  entity_id: number;
  target_user_wallet: string;
  credit_amount?: number;
  credit_asset_name?: AssetName.Credit;
  token_amount?: number;
  token_asset_name?: AssetName.Token;
  detailed_type: string;
  comment: string;
}

export const createBudgetApplications = (data: ICreateBudgeApplicationRequest[]) => {
  return request.post(`${PATH_PREFIX}`, data);
};

// approve
export const approveApplications = (application_ids: number[]) => {
  return request.post(`/apps_approve`, application_ids);
};
export const approveApplicationByID = (application_id: number) => {
  return request.post(`${PATH_PREFIX}${application_id}/approve`);
};

// reject
export const rejectApplications = (application_ids: number[]) => {
  return request.post(`/apps_reject`, application_ids);
};
export const rejectApplicationByID = (application_id: number) => {
  return request.post(`${PATH_PREFIX}${application_id}/reject`);
};

// complete
export const compeleteApplications = (data: string[]) => {
  return request.post(`/apps_complete`, {
    message: data.join(','),
  });
};
// process
export const processApplications = (data: number[]) => {
  return request.post(`/apps_process`, data);
};

// download
export const getTemplateFileUrl = (language?: string) => {
  return `https://superapp-backend-prod.s3.ap-northeast-1.amazonaws.com/templates/upload_template_${
    language || 'en'
  }.xlsx`;
};
export const getExportFileUrl = (ids: number[]) => {
  return `${getBaseURL()}/download_applications?ids=${ids.join(',')}`;
};

interface IApplicantRequest {
  entity: 'project' | 'guild';
  entity_id: number;
}

interface IApplicant {
  Applicant: string;
  Name: string;
}

// applicants
export const getApplicants = (data?: IApplicantRequest): Promise<ResponseData<IApplicant[]>> => {
  return request.get(`/apps_applicants`, data);
};

// bundle
export const getApplicationBundle = (
  data: IPageParams,
  queryData: IQueryParams,
): Promise<ResponseData<IPageResponse<IApplicantBundle>>> => {
  return request.get(`${BUNDLE_PATH_PREFIX}`, {
    ...data,
    type: ApplicationType.NewReward,
    ...queryData,
  });
};

// export type ApplicantBundleRecord = {
//   wallet: string;
//   asset_name: string;
//   asset_amount: number;
// };

type ApplicantBundleRecord = {
  amount: number;
  asset_name: string;
  comment: string;
  detailed_type: string;
  entity: string;
  entity_id: number;
  target_user_wallet: string;
};

interface ICreateApplicantBundle {
  entity_id: number;
  entity: ApplicationEntity;
  comment: string;
  records: ApplicantBundleRecord[];
}

export const createApplicationBundles = (data: ICreateApplicantBundle) => {
  return request.post(`${BUNDLE_PATH_PREFIX}`, data);
};

export const getSeasons = (): Promise<ResponseData<ISeason[]>> => {
  return request.get(`/seasons/`);
};

// approve
export const approveBundleByID = (bundle_id: number) => {
  return request.post(`${BUNDLE_PATH_PREFIX}${bundle_id}/approve`);
};
export const approveBundles = (bundle_ids: number[]) => {
  return request.post('/app_bundle_approve', bundle_ids);
};
// reject
export const rejectBundleByID = (bundle_id: number) => {
  return request.post(`${BUNDLE_PATH_PREFIX}${bundle_id}/reject`);
};
export const rejectBundles = (bundle_ids: number[]) => {
  return request.post('/app_bundle_reject', bundle_ids);
};

interface ISourceResponse {
  projects: ReTurnProject[];
  guilds: ReTurnProject[];
}

export const getAvailiableProjectsAndGuilds = (): Promise<ResponseData<ISourceResponse>> => {
  return request.get(`${BUNDLE_PATH_PREFIX}available_projects_guilds`);
};
