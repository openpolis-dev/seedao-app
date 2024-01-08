import axios, { AxiosResponse } from 'axios';
import { ICategory, IBaseProposal } from 'type/proposal.type';

export const apiHost = 'https://metaforo.io/api';

const instance = axios.create({
  baseURL: apiHost,
  headers: {
    api_key: 'metaforo_website',
  },
});

export function initApiService(token: string) {
  if (token) {
    instance.defaults.headers['Authorization'] = 'Bearer ' + token;
  }
}

function handleResponse(res: AxiosResponse) {
  if (res.status === 200) {
    if (res.data.data && res.data.data.api_token) {
      initApiService(res.data.data.api_token);
    }
    return res.data;
  }
}

export interface ResponseData<T = any> {
  code: number;
  status: string;
  data: T;
}

const post = function (path: string, params: any = {}): Promise<ResponseData> {
  return instance.post(path, params).then(handleResponse);
};

/**
 * get
 * @method get
 * @param {url, params}
 */
const get = function (url: string, params: any = {}): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
        headers: {
          api_key: 'metaforo_website',
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

interface IProposalCategoriesData {
  group: {
    categories: ICategory[];
  };
}

export const getCategories = (): Promise<ResponseData<IProposalCategoriesData>> => {
  return get('https://forum.seedao.xyz/api/custom/group/info');
};

interface IPageParams {
  page: number;
  per_page: number;
}

interface IListProposalsParams extends IPageParams {
  sort: 'latest' | 'new' | 'old';
}

interface IListProposalsData {
  threads: IBaseProposal[];
}

export const getAllProposals = (data: IListProposalsParams): Promise<ResponseData<IListProposalsData>> => {
  return get(
    'https://forum.seedao.xyz/api/thread/list?filter=all&category_index_id=0&tag_id=0&sort=latest&group_name=seedao',
    data,
  );
};

interface ISubCategoryProposalsParams extends IListProposalsParams {
  category_index_id: number;
}

export const getProposalsBySubCategory = (
  data: ISubCategoryProposalsParams,
): Promise<ResponseData<IListProposalsData>> => {
  return get('https://forum.seedao.xyz/api/thread/list?filter=category&tag_id=0&group_name=seedao', data);
};

interface IProposalResponseData {
  thread: IBaseProposal;
}

export const getProposalDetail = (pid: number): Promise<ResponseData<IProposalResponseData>> => {
  return get(`https://forum.seedao.xyz/api/get_thread/${pid}?group_name=seedao`);
};

export type LoginParam = {
  web3_public_key: string;
  // 3 = ar, 5 = eth (metamask or walletconnect)
  wallet_type: number;
  // Only use for arConnect
  web3_address: string | undefined;
  sign: string;
  signMsg: string;
  group_name: string | undefined;
  display_name: string | undefined;
  display_avatar: string | undefined;
};

export function loginByWallet(param: LoginParam) {
  return post('/wallet/sso', param).then((res) => {
    return res.data;
  });
}
