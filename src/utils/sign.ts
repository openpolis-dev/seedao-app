import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

export const signMessage = (account: string, timestamp: number) => {
  const msg = `rfa#${account}#${timestamp}`;

  try {
    const sign_1 = `0x${Buffer.from(msg, 'utf8').toString('hex')}`;
    const sign_2 = ethers.utils.keccak256(sign_1);
    const sign_3 = `0x${Buffer.from(sign_2, 'utf8').toString('hex')}`;
    return sign_3;
  } catch (err) {
    console.error(err);
  }
};

export const createSiweMessage = (address: string, chainId: number, nonce: string, statement: string) => {
  const siweMessage = new SiweMessage({
    domain: (window as any).AppConfig.host,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: chainId,
    nonce,
  });

  // return siweMessage;
  return (siweMessage as any).prepareMessage();
};
