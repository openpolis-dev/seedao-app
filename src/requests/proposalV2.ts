import request, { ResponseData } from './http';
import {
  IProposal,
  ISimpleProposal,
  ProposalState,
  IContentBlock,
  IBaseCategory,
  IActivity,
} from 'type/proposalV2.type';
import { METAFORO_TOKEN, SEEDAO_USER } from 'utils/constant';
import { parseToken, checkTokenValid, clearStorage } from 'utils/auth';

const PATH_PREFIX = '/proposals/';

const getMetaforoData = () => {
  try {
    const tokenstr = localStorage.getItem(SEEDAO_USER);
    if (tokenstr) {
      const tokenData = parseToken(tokenstr);
      if (!checkTokenValid(tokenData?.token, tokenData?.token_exp)) {
        clearStorage();
        return;
      }
      const data = localStorage.getItem(METAFORO_TOKEN);
      const metaforoData = JSON.parse(data || '');
      // @ts-ignore FIXME: tokenData is not defined a correct type
      const local_account = tokenData?.user?.data?.wallet || tokenData?.user?.wallet;

      if (local_account?.toLowerCase() === metaforoData.account?.toLowerCase()) {
        return metaforoData;
      }

      return;
    }
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

type CreateProposalParamsType = {
  title: string;
  proposal_category_id: number;
  template_id?: number | string;
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
  console.log('=====getMetaforoData', data);
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

export const checkCanVote = (id: number) => {
  return request.post(`${PATH_PREFIX}can_vote/${id}`);
};

export const castVote = (id: number, vote_id: number, option: number) => {
  return request.post(`${PATH_PREFIX}vote/${id}`, {
    vote_id,
    options: [option],
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
  return request.post(`${PATH_PREFIX}approve/${id}`);
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
