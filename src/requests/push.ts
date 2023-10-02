import request from './http';

const PATH_PREFIX = '/push';

interface IRegisterDeviceParams {
  device: 'pc' | 'mobile';
  push_subscription: PushSubscriptionJSON;
  wallet: string;
}

export const registerDevice = (data: IRegisterDeviceParams) => {
  request.post(`${PATH_PREFIX}/register`, data);
};
