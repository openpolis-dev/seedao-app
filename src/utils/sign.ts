import { ethers } from 'ethers';

export const signMessage = (account: string, timestamp: number) => {
  const msg = `rfa#${account}#${timestamp}`;

  try {
    const sign_1 = `0x${Buffer.from(msg, 'utf8').toString('hex')}`;
    const sign_2 = ethers.keccak256(sign_1);
    const sign_3 = `0x${Buffer.from(sign_2, 'utf8').toString('hex')}`;
    return sign_3;
  } catch (err) {
    console.error(err);
  }
};
