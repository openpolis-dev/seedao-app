import request, { ResponseData } from './http';
import { IProposal, ISimpleProposal, ProposalState, IContentBlock, IBaseCategory } from 'type/proposalV2.type';
import { METAFORO_TOKEN } from 'utils/constant';

const PATH_PREFIX = '/proposals/';

interface IProposalPageParams extends IPageParams {
  category_id?: number;
  state?: ProposalState;
  q?: string;
}

export const getProposalCategoryList = (): Promise<ResponseData<IBaseCategory[]>> => {
  return request.get(`/proposal_categories/`);
};

export const getProposalList = (data: IProposalPageParams): Promise<ResponseData<IPageResponse<ISimpleProposal>>> => {
  return request.get(`${PATH_PREFIX}list`, data);
};

export const getProposalDetail = (id: number, startPostId?: number): Promise<ResponseData<IProposal>> => {
  return request.get(
    `${PATH_PREFIX}show/${id}`,
    {
      start_post_id: startPostId,
    },
    {
      metaforo_access_token: localStorage.getItem(METAFORO_TOKEN),
    },
  );
};

type CreateProposalParamsType = {
  title: string;
  proposal_category_id: number;
  content_blocks: IContentBlock[];
  submit_to_metaforo: boolean;
};

export const getUserActions = () => {
  return request.get(
    '/user/metaforo_activities',
    {},
    {
      metaforo_access_token: localStorage.getItem(METAFORO_TOKEN),
    },
  );
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

export const withdrawProposal = (id: number) => {
  return request.post(`${PATH_PREFIX}withdraw/${id}`);
};

export const castVote = (id: number, vote_id: number, option: number) => {
  return request.post(`${PATH_PREFIX}vote/${id}`, {
    vote_id,
    options: [option],
    metaforo_access_token: localStorage.getItem(METAFORO_TOKEN),
  });
};

// =========== comment ===========

// NOTE: reply_id is metaforo_id
export const addComment = (id: number, content: string, reply_id?: number) => {
  return request.post(`${PATH_PREFIX}add_comment/${id}`, {
    content,
    reply_id,
    editor_type: 0,
    metaforo_access_token: localStorage.getItem(METAFORO_TOKEN),
  });
};

export const editCommet = (id: number, cid: number) => {
  return request.post(`${PATH_PREFIX}delete_comment/${id}`, {
    post_id: cid,
    metaforo_access_token: localStorage.getItem(METAFORO_TOKEN),
  });
};

export const deleteCommet = (id: number, cid: number) => {
  return request.post(`${PATH_PREFIX}delete_comment/${id}`, {
    metaforo_access_token: localStorage.getItem(METAFORO_TOKEN),
  });
};

// =========== review ===========

export const approveProposal = (id: number) => {
  return request.post(`${PATH_PREFIX}approve/${id}`);
};

export const rejectProposal = (id: number, reason: string) => {
  return request.post(`${PATH_PREFIX}reject/${id}`, {
    reason,
    metaforo_access_token: localStorage.getItem(METAFORO_TOKEN),
  });
};
