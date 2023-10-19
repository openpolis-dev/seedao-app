// Project Module API
import request from './http';
import { Ievent } from 'type/event';
import axios from 'axios';

const PATH_PREFIX = '/events';

export const createEvent = (data: Ievent) => {
  return request.post(`${PATH_PREFIX}/`, data);
};

export const uplodaEventImage = async (filename: string, type: string, fileData: File) => {
  const url = await request.get(`url_for_uploading_s3?filename=${filename}&type=${type}`);
  try {
    const rt = await axios.put(url?.data, fileData, {
      headers: {
        'Content-Type': type,
      },
    });
    if (rt.status === 200) {
      return url?.data.split('?')[0];
    }
  } catch (e) {
    console.error(e);
  }
};

export const getEventList = (data: IPageParams) => {
  return request.get(`${PATH_PREFIX}/`, data);
};
export const getEventById = (id: string) => {
  return request.get(`${PATH_PREFIX}/${id}`);
};

export const editEventById = (id: string, data: Ievent) => {
  return request.put(`${PATH_PREFIX}/${id}`, data);
};

export const getMyEvent = (data: IPageParams) => {
  return request.get(`my_events`, data);
};

const SEEU_API = 'https://seeu-network-backend.vercel.app/api/event/list';
type SeeuParams = {
  pageSize: number;
  currentPage: number;
  type?: 'end';
};
export const getSeeuEventList = async (data: SeeuParams) => {
  try {
    const resp = await axios.get(`${SEEU_API}`, { params: data });
    if (resp.status === 200 && resp.data?.success && resp.data?.err_code === 0) {
      return resp.data;
    }
    throw Error(`status is ${resp.status}, err_code is ${resp.data?.err_code}`);
  } catch (error: any) {
    throw Error(error);
  }
};
