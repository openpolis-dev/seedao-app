import axios from 'axios';
import { ICategory } from 'type/proposal.type';

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
