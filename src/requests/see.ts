import request, { ResponseData } from './http';

const PATH_PREFIX = '/asset_trade/';


interface dataParams {
  to:string;
  asset_name?:string;
  amount:string | number;
  comment:string;
}

export const transferSEE = (data:dataParams): Promise<ResponseData<any>> => {
  return request.post(`${PATH_PREFIX}/new`,data);
};

interface dataObj {
  from_user?:string;
  to_user?:string;
  page:string | number;
  size:string | number;
}

export const getSeeList = (data:dataObj): Promise<ResponseData<any>> => {

  const {from_user,to_user,page,size} = data;
  return request.get(`${PATH_PREFIX}/my?from_user=${from_user??""}&to_user=${to_user??""}&page=${page}&size=${size}`);
};

export const claimSee = (): Promise<ResponseData<any>> => {

  return request.post(`${PATH_PREFIX}claim_see`);
};


