import request, { ResponseData } from './http';
import { IProposal, ISimpleProposal, ProposalState, IContentBlock } from 'type/proposalV2.type';

const PATH_PREFIX = '/proposals/';

interface IProposalPageParams extends IPageParams {
  category_id?: number;
  state?: ProposalState;
}

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
  metaforo_access_token: string;
  submit_to_metaforo: boolean;
};

export const saveOrSubmitProposal = (data: CreateProposalParamsType) => {
  return request.post(`${PATH_PREFIX}create`, data);
};
