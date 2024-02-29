import request, { ResponseData } from './http';

const PATH_PREFIX = '/sns_invite/';

export const getInviteCode = (): Promise<ResponseData<{ invite_code: string }>> => {
  return request.get(`${PATH_PREFIX}my_sns_invite_code`);
};
type RewardsData = {
  invite_count: number;
  total_rewards: number;
};

export const getMyRewards = (): Promise<ResponseData<RewardsData>> => {
  return request.get(`${PATH_PREFIX}my_sns_invite_rewards`);
};

export const inviteBy = (invite_code: string) => {
  return request.post(`${PATH_PREFIX}invited_by/${invite_code}`);
};
