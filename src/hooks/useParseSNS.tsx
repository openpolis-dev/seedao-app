import sns from '@seedao/sns-js';

import { useEffect, useState } from 'react';
import getConfig from "../utils/envCofnig";
import PublicJs from "../utils/publicJs";

export default function useParseSNS(wallet?: string) {
  const [name, setName] = useState<string>();

  useEffect(() => {
    if (wallet) {
      sns.name(wallet,getConfig().NETWORK.rpcs[0]).then((res) => {
        setName(res);
      });
    }
  }, [wallet]);
  return name;
}

export type NameMapType = { [wallet: string]: string };

export function useParseSNSList(wallets: string[] = []) {
  const [nameMap, setNameMap] = useState<NameMapType>({});

  useEffect(() => {
    getSNS(wallets)
  }, [wallets]);

  const getSNS = async(wallets:string[]) =>{

    if(wallets.length){
      // let res = await sns.names(wallets,getConfig().NETWORK.rpcs[0]);
      let res = await PublicJs.splitWallets(wallets);
      const _name_map:any = {};
      res.forEach((r, idx) => {
        _name_map[wallets[idx]] = r;
      });
      setNameMap(_name_map);
    }else{
      setNameMap({});
    }

  }

  return nameMap;
}
