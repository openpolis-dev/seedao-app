import request, { ResponseData, getBaseURL } from './http';

const PATH_PREFIX = '/publicity/';


export const getPublicity = (page:number|string,size:number) =>{
  return request.get(`${PATH_PREFIX}list?page=${page}&size=${size}`);
}


export const getPublicityDetail = (id:number|string) =>{
  return request.get(`${PATH_PREFIX}detail/${id}`);
}

export const createPublicity = (data:{title:string,content:string}) =>{
  return request.post(`${PATH_PREFIX}create`,data);
}

export const updatePublicity = (data:{title:string,content:string,id:number}) =>{
  return request.post(`${PATH_PREFIX}update/${data.id}`,data);
}

export const deletePublicity = (id:number) =>{
  return request.delete(`${PATH_PREFIX}delete/${id}`);
}
