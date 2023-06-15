import axios from 'axios';
import { ICategory, IBaseProposal } from 'type/proposal.type';

export interface ResponseData<T = any> {
  code: number;
  status: string;
  data: T;
}

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
  sort: 'latest' | 'ordest';
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
