import request, { ResponseData } from './http';
import {
  IProposal,
  ISimpleProposal,
  ProposalState,
  IContentBlock,
  IBaseCategory,
  IActivity,
  ICategoryWithTemplates,
} from 'type/proposalV2.type';
import { SEE_AUTH } from 'utils/constant';

const PATH_PREFIX = '/proposals/';

export const getMetaforoData = () => {
  try {
    const seeauth = localStorage.getItem(SEE_AUTH);
    const authData = JSON.parse(seeauth || '');
    return authData?.metaforo;
  } catch (error) {}
};

interface IProposalPageParams extends IPageParams {
  category_id?: number;
  state?: ProposalState;
  q?: string;
}

export const getProposalCategoryList = (): Promise<ResponseData<IBaseCategory[]>> => {
  return request.get(`/proposal_categories/list`);
};

export const getAuthProposalCategoryList = (): Promise<ResponseData<IBaseCategory[]>> => {
  return request.get(`/proposal_categories/list_with_perm`);
};

export const getProposalList = (data: IProposalPageParams): Promise<ResponseData<IPageResponse<ISimpleProposal>>> => {
  return request.get(`${PATH_PREFIX}list`, data);
};

// my
export const getMyProposalList = (
  data: IProposalPageParams,
  isPendingSubmit?: boolean,
): Promise<ResponseData<IPageResponse<ISimpleProposal>>> => {
  return request.get(`${PATH_PREFIX}my`, { ...data, pending_submit: isPendingSubmit ? 1 : undefined });
};

export const getProposalDetail = (id: number, startPostId?: number): Promise<ResponseData<IProposal>> => {
  return request.get(
    `${PATH_PREFIX}show/${id}`,
    {
      start_post_id: startPostId,
      access_token: getMetaforoData()?.token,
    },
    {},
  );
};

export const getCloseProposal = (
  id: number,
): Promise<
  ResponseData<
    {
      id: number;
      title: string;
    }[]
  >
> => {
  return request.get(
    `${PATH_PREFIX}creating_project_proposals`,
    {
      category_id: id,
    },
    {},
  );
};

type CreateProposalParamsType = {
  title: string;
  proposal_category_id: number | undefined;
  vote_type?: number | undefined;
  create_project_proposal_id?: any;
  template_id?: number | string;
  vote_options?: string[] | null;
  content_blocks: IContentBlock[];
  submit_to_metaforo: boolean;
  components: any;
};

export const getUserActions = (
  size: number,
  session?: string,
): Promise<ResponseData<{ records: IActivity[]; session: string }>> => {
  const data = getMetaforoData();
  return request.get('/user/metaforo_activities', {
    size,
    session,
    metaforo_access_token: data?.token,
    userId: data?.id,
  });
};

export const prepareMetaforo = () => {
  const data = getMetaforoData();
  return request.post('/user/prepare_metaforo', {
    api_token: data?.token,
    user: { id: data.id },
  });
};

export const saveOrSubmitProposal = (data: CreateProposalParamsType): Promise<ResponseData<IProposal>> => {
  return request.post(`${PATH_PREFIX}create`, {
    ...data,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const updateProposal = (id: number, data: CreateProposalParamsType): Promise<ResponseData<IProposal>> => {
  return request.post(`${PATH_PREFIX}update/${id}`, {
    ...data,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const withdrawProposal = (id: number) => {
  return request.post(`${PATH_PREFIX}withdraw/${id}`);
};

// =========== vote ===========

export const checkCanVote = (id: number): Promise<ResponseData<boolean>> => {
  return request.post(`${PATH_PREFIX}can_vote/${id}`);
};

export const castVote = (id: number, vote_id: number, option: number) => {
  return request.post(`${PATH_PREFIX}vote/${id}`, {
    vote_id,
    options: [option],
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const closeVote = (id: number, vote_id: number) => {
  return request.post(`${PATH_PREFIX}close_vote/${id}`, {
    vote_id,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export type VoterType = {
  wallet: string;
  os_avatar: string;
};

export const getVotersOfOption = (option_id: number, page: number): Promise<ResponseData<VoterType[]>> => {
  return request.get(`${PATH_PREFIX}vote_detail/${option_id}`, {
    page,
  });
};

// =========== comment ===========

// NOTE: reply_id is metaforo_id
export const addComment = (id: number, content: string, reply_id?: number) => {
  return request.post(`${PATH_PREFIX}add_comment/${id}`, {
    content,
    reply_id,
    editor_type: 0,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const editCommet = (id: number, content: string, cid: number) => {
  return request.post(`${PATH_PREFIX}edit_comment/${id}`, {
    post_id: cid,
    content,
    editor_type: 0,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const deleteCommet = (id: number, cid: number) => {
  return request.post(`${PATH_PREFIX}delete_comment/${id}`, {
    post_id: cid,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

// =========== review ===========

export const approveProposal = (id: number) => {
  return request.post(`${PATH_PREFIX}approve/${id}`, {
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const rejectProposal = (id: number, reason: string) => {
  return request.post(`${PATH_PREFIX}reject/${id}`, {
    reason,
    metaforo_access_token: getMetaforoData()?.token,
  });
};

export const getTemplate = () => {
  return request.get('/proposal_tmpl/');
};
export const getComponents = () => {
  return request.get('/proposal_components/');
};

export const getTemplates = (): Promise<ResponseData<ICategoryWithTemplates[]>> => {
  return request.get('/proposal_tmpl/list_with_perm');
};
