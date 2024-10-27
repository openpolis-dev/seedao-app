import request, { BASE_URL, ResponseData } from "./http";
import { ISeason } from 'type/application.type';
import axios from "axios";
import { SBT_BASEURL } from "../utils/constant";

const PATH_PREFIX = '/cityhall';

export enum MemberGroupType {
  Governance = 'G_GOVERNANCE',
  Brand = 'G_BRANDING',
  Tech = 'G_TECH',
}

interface ICityHallResponse {
  id: number;
  grouped_sponsors: { [k: string]: string[] };
}

export const getCityHallDetail = (): Promise<ResponseData<ICityHallResponse>> => {
  return request.get(`${PATH_PREFIX}/info`);
};
export const getCityHallNode = (): Promise<ResponseData> => {
  return request.get(`${PATH_PREFIX}/cs_node`);
};

interface IUpdateMemberParams {
  add?: string[];
  remove?: string[];
  group_name?: MemberGroupType;
}

export const updateMembers = (data: IUpdateMemberParams) => {
  return request.post(`${PATH_PREFIX}/update_members`, data);
};

export const batchUpdateMembers = (data: IUpdateMemberParams[]) => {
  return request.post(`${PATH_PREFIX}/batch_update_members`, data);
};

export interface IUpdateBudgetParams {
  asset_name: string;
  total_amount: number;
  asset_type: string;
}

export const UpdateBudget = (data: IUpdateBudgetParams) => {
  return request.post(`${PATH_PREFIX}/update_budget`, data);
};

export const getGovernanceNodeResult = () => {
  return request.get('data_srv/aggr_scr');
};

// snapshot
export const requestSnapshotSeed = () => {
  return request.post('rewards/snapshot_seed');
};
// send reward
export const requestApproveMintReward = () => {
  return request.post('rewards/approve_mint_reward');
};

export const getCurrentSeason = (): Promise<ResponseData<ISeason>> => {
  return request.get(`/seasons/current`);
};


const organization_id = 1

export const getSBTlist = async(token:string) => {
  let rt:any= await axios.get(`${SBT_BASEURL}organization/${organization_id}/nfts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return rt.data
};
interface ISBT {
  token:string;
  organization_id:any;
  nft_id:any;
  receivers:string;
  organization_contract_id:any
}

export const applySBT = async(obj:ISBT) => {
  const{token,organization_id,nft_id,receivers,organization_contract_id} = obj
  let rt:any= await axios.post(`${SBT_BASEURL}organization/${organization_id}/mint`, {
    organization_contract_id,
    nft_id,
    receivers
  },{
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    }
  });
  return rt.data
};

export const getAuditList = async(token:string,page:number,size:number,type:string) => {
  let rt:any= await axios.get(`${SBT_BASEURL}organization/${organization_id}/mints?page=${page}&size=${size}&sort_field=created_at&sort_order=desc&status=${type}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return rt.data
};


export const operateAudit = async(token:string,id:number,type:string) => {
  let rt:any= await axios.put(`${SBT_BASEURL}organization/${organization_id}/mint/${type}/${id}`,null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return rt.data
};

export const uploadFile = async(token:string,file:any)=>{
  let rt:any= await axios.post(`${SBT_BASEURL}upload/file`,file, {
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'multipart/form-data;boundary=boundary'
    }
  });
  return rt.data
};

export const getContracts = async(token:string) => {
  let rt:any= await axios.get(`${SBT_BASEURL}organization/${organization_id}/contracts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return rt.data
};

export const createSBT = async(token:string,obj:any)=>{
  let rt:any= await axios.post(`${SBT_BASEURL}organization/${organization_id}/nft`,obj, {
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    }
  });
  return rt.data
};

export const distribute = async(token:string,id:number,mint_tx_hash:string) => {
  let rt:any= await axios.put(`${SBT_BASEURL}organization/${organization_id}/mint/minted/${id}/${mint_tx_hash}`,null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return rt.data
};
