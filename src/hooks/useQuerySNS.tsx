import { AppActionType, useAuthContext } from 'providers/authProvider';
import sns from '@seedao/sns-js';

import { ethers } from 'ethers';
import getConfig from "../utils/envCofnig";

export default function useQuerySNS() {
  const {
    state: { snsMap, rpc },
    dispatch,
  } = useAuthContext();

  const querySNS = async (wallet: string) => {
    try {
      const data = await sns.name(wallet,getConfig().NETWORK.rpcs[0]);
      return data;
    } catch (error) {
      return '';
    }
  };

  const getSNS = async (wallet: string) => {
    const _wallet = wallet.toLocaleLowerCase();
    if (snsMap.get(_wallet)) {
      return snsMap.get(_wallet);
    }
    const res = await querySNS(_wallet);
    if (res) {
      const _snsMap = new Map(snsMap);
      _snsMap.set(_wallet, res);
      dispatch({ type: AppActionType.SET_SNS_MAP, payload: _snsMap });
    }

    return res || _wallet;
  };

  const getMultiSNS = async (wallets: string[]) => {
    const wallet_sns_map = new Map<string, string>();
    const _wallets = wallets.map((w) => w.toLocaleLowerCase());
    const _to_be_queried = _wallets.filter((w) => !snsMap.get(w));

    const _snsMap = new Map(snsMap);
    if (_to_be_queried.length) {
      try {
        const data = await sns.names(_to_be_queried, getConfig().NETWORK.rpcs[0]);
        data.forEach((d, idx) => {
          _snsMap.set(_to_be_queried[idx], d || ethers.utils.getAddress(_to_be_queried[idx]));
        });
      } catch (error) {
        console.log(error);
      }
    }

    dispatch({ type: AppActionType.SET_SNS_MAP, payload: _snsMap });

    _wallets.forEach((w) => {
      wallet_sns_map.set(w, _snsMap.get(w) || w);
    });
    return wallet_sns_map;
  };

  return { getSNS, getMultiSNS };
}
