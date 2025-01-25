import axios from 'axios';
import { ethers } from 'ethers';
import sns from "@seedao/sns-js";
import getConfig from "./envCofnig";

const AddressToShow = (address: string, num?: number) => {
  if (!address) return '';
  const n = num || 4;
  if (address.length < n) {
    return address;
  }

  const frontStr = address.substring(0, n + 2);

  const afterStr = address.substring(address.length - n, address.length);

  return `${frontStr}...${afterStr}`;
};

const IPFS_BASES = [
  'https://gateway.pinata.cloud/ipfs',
  'https://gateway.ipfs.io/ipfs',
  'https://ipfs.io/ipfs',
  'https://cf-ipfs.com/ipfs',
  'https://dweb.link/ipfs',
  'https://ipfs.eth.aragon.network/ipfs',
];

async function agumentedIpfsGet(hash: string) {
  const promises = IPFS_BASES.map(async (ipfsBase) => {
    try {
      let rt = await axios.get(`${ipfsBase}/${hash}`);
      if (rt.status === 200) {
        return `${ipfsBase}/${hash}`;
      } else {
        return Promise.reject(rt.status);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  });

  try {
    const result = await Promise.any(promises);
    return result;
  } catch (e) {
    return Promise.reject(e);
  }
}

const getImage = async (img: string) => {
  if (!img) return;
  if (img.indexOf('http://') > -1 || img.indexOf('https://') > -1) {
    return img;
  } else {
    let str = img;
    if (img.indexOf('ipfs://') > -1) {
      str = img.split('ipfs://')[1];
    }
    try {
      let imgAA = await agumentedIpfsGet(str);
      return imgAA;
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
const getSeedUrl = async (img: string) => {
  if (!img) return;
  if (img.indexOf('http://') > -1 || img.indexOf('https://') > -1) {
    return img;
  } else {
    let str = img;
    if (img.indexOf('ipfs://') > -1) {
      str = img.split('ipfs://')[1];
    }
    // return `http://ipfs-proxy-bkt.s3-website-ap-northeast-1.amazonaws.com/${str}`;
    return `https://nftcdn.seedao.tech/${str}`;
    // try {
    //   let imgAA = await agumentedIpfsGet(str);
    //   return imgAA;
    // } catch (e) {
    //   return Promise.reject(e);
    // }
  }
};

const filterTags = (html: string) => {
  const decodedStr = html.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
  const decodedHtmlWithHex = decodedStr.replace(/&#x([0-9A-Fa-f]+);/g, function (match, hex) {
    return String.fromCharCode(parseInt(hex, 16));
  });
  const decodedHtml = decodedHtmlWithHex.replace(/&(amp|lt|gt|quot|#39);/g, function (match, entity) {
    const entities: any = {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"',
      '#39': "'",
    };
    return entities[entity];
  });
  const unicodeDecodedStr = decodedHtml.replace(/\\u([\d\w]{4})/gi, function (match, hex) {
    return String.fromCharCode(parseInt(hex, 16));
  });
  const unicodeHexDecodedStr = unicodeDecodedStr.replace(/\\x([\d\w]{2})/gi, function (match, hex) {
    return String.fromCharCode(parseInt(hex, 16));
  });
  return unicodeHexDecodedStr.replace(/(<([^>]+)>)/gi, '');
};

const checkRPCavailable = (rpc_list: string[], network: { chainId: number; name: string }) => {
  return Promise.any(
    rpc_list.map((r) => {
      const provider = new ethers.providers.JsonRpcProvider(r, network);
      try {
        provider.getBlock('latest');
        return r;
      } catch (error) {
        throw Error(`[rpc] not available - ${r}`);
      }
    }),
  ).then((result) => {
    console.log('[rpc] choose', result);
    return result;
  });
};

function typedData(address: string, chainId: number) {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        {
          name: 'chainId',
          type: 'uint256',
        },
      ],
      Login: [
        { name: 'account', type: 'address' },
        { name: 'message', type: 'string' },
      ],
    },
    primaryType: 'Login',
    domain: {
      name: 'Metaforo',
      version: '1.0',
      chainId: chainId,
    },
    message: {
      account: address,
      message: 'Login to Metaforo',
    },
  };
}


const splitWallets = async(wallets:string[]) =>{
  const chunkSize = 300;
  const result = [];
  const resultArr = [];

  for (let i = 0; i < wallets.length; i += chunkSize) {
    const chunk = wallets.slice(i, i + chunkSize);
    result.push(chunk);
  }

  for await (const chunk of result) {
    try{
      const data = await sns.names(chunk, getConfig().NETWORK.rpcs[0]);
      resultArr.push(...data);
    }catch(error){
      console.error(error)
    }

  }
  return resultArr;
}

export default { AddressToShow, getImage, filterTags, checkRPCavailable, getSeedUrl, typedData,splitWallets };
