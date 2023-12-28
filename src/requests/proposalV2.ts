import request, { ResponseData } from './http';
import { IProposal, ISimpleProposal, ProposalState, IContentBlock, IBaseCategory } from 'type/proposalV2.type';
import { METAFORO_TOKEN } from 'utils/constant';

const PATH_PREFIX = '/proposals/';

interface IProposalPageParams extends IPageParams {
  category_id?: number;
  state?: ProposalState;
}

export const getProposalCategoryList = (): Promise<ResponseData<IBaseCategory[]>> => {
  return request.get(`/proposal_categories/`);
};

export const getProposalList = (data: IProposalPageParams): Promise<ResponseData<IPageResponse<ISimpleProposal>>> => {
  return request.get(`${PATH_PREFIX}list`, data);
};

export const getProposalDetail = (id: number): Promise<ResponseData<IProposal>> => {
  return request.get(`${PATH_PREFIX}show/${id}`);
};

type CreateProposalParamsType = {
  title: string;
  proposal_category_id: number;
  content_blocks: IContentBlock[];
  submit_to_metaforo: boolean;
};

export const saveOrSubmitProposal = (data: CreateProposalParamsType): Promise<ResponseData<IProposal>> => {
  return request.post(`${PATH_PREFIX}create`, {
    ...data,
    metaforo_access_token: localStorage.getItem(METAFORO_TOKEN),
  });
};

export const updateProposal = (id: number, data: CreateProposalParamsType): Promise<ResponseData<IProposal>> => {
  return request.post(`${PATH_PREFIX}update/${id}`, {
    ...data,
    metaforo_access_token: localStorage.getItem(METAFORO_TOKEN),
  });
};
