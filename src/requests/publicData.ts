// Public Data API
import request, { ResponseData } from './http';

const PATH_PREFIX = '/public_data/bounty';

export const publicList = (data: any) => {
  return request.get(`${PATH_PREFIX}/list`, data);
};
export const pubDetail = (id: string) => {
  return request.get(`${PATH_PREFIX}/detail/${id}`);
};
