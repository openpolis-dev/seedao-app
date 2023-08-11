// Project Module API
import request, { API_VERSION, BASE_URL, ResponseData } from './http';
import { Ievent } from 'type/event';

const PATH_PREFIX = '/event';

export const createEvent = (id: string, data: Ievent) => {
  return request.post(`${PATH_PREFIX}/${id}`, data);
};
