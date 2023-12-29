import { SELECT_WALLET } from 'utils/constant';
import { Wallet } from 'wallet/wallet';
import { ethers } from 'ethers';
import CONTROLLER_ABI from 'assets/abi/SeeDAORegistrarController.json';
import REGISTER_ABI from 'assets/abi/SeeDAOMinter.json';
import { builtin } from '@seedao/sns-js';
import { useAuthContext } from 'providers/authProvider';
import { erc20ABI, useSendTransaction, useContractRead, Address } from 'wagmi';
import { Hex } from 'viem';

import getConfig from 'utils/envCofnig';
const networkConfig = getConfig().NETWORK;
const PAY_TOKEN = networkConfig.tokens[0];
const PAY_NUMBER = PAY_TOKEN.price;

export enum TX_ACTION {
  COMMIT = 'commit',
  PAY_MINT = 'register',
  WHITE_MINT = 'whitelist',
}

const buildApproveData = () => {
  const iface = new ethers.utils.Interface(erc20ABI);
  return iface.encodeFunctionData('approve', [
    builtin.SEEDAO_MINTER_ADDR,
    ethers.utils.parseUnits(String(PAY_NUMBER), PAY_TOKEN.decimals),
  ]);
};

const buildCommitData = (commitment: string) => {
  const iface = new ethers.utils.Interface(CONTROLLER_ABI);
  return iface.encodeFunctionData('commit', [commitment]);
};

const buildRegisterData = (sns: string, secret: string) => {
  const iface = new ethers.utils.Interface(REGISTER_ABI);
  return iface.encodeFunctionData('register', [sns, builtin.PUBLIC_RESOLVER_ADDR, secret, PAY_TOKEN.address]);
};

const buildWhitelistRegisterData = (sns: string, secret: string, proof: string) => {
  const iface = new ethers.utils.Interface(REGISTER_ABI);
  return iface.encodeFunctionData('registerWithWhitelist', [
    sns,
    builtin.PUBLIC_RESOLVER_ADDR,
    secret,
    networkConfig.whitelistId,
    proof,
  ]);
};

export default function useTransaction() {
  const {
    state: { account },
  } = useAuthContext();

  const { sendTransactionAsync } = useSendTransaction();

  const { data: allowanceResult } = useContractRead({
    address: PAY_TOKEN.address as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [account as Address, builtin.SEEDAO_MINTER_ADDR as Address],
  });

  const handleCommit = async (wallet: Wallet, commitment: string) => {
    const tx = await sendTransactionAsync({
      to: builtin.SEEDAO_REGISTRAR_CONTROLLER_ADDR,
      account: account as Address,
      value: BigInt(0),
      data: buildCommitData(commitment) as Hex,
    });
    return tx?.hash;
  };

  const handleRegister = async (wallet: Wallet, sns: string, secret: string) => {
    const tx = await sendTransactionAsync({
      to: builtin.SEEDAO_MINTER_ADDR,
      account: account as Address,
      value: BigInt(0),
      data: buildRegisterData(sns, ethers.utils.formatBytes32String(secret)) as Hex,
    });
    return tx?.hash;
  };

  const handleFreeMint = async (wallet: Wallet, sns: string, secret: string, proof: string) => {
    const tx = await sendTransactionAsync({
      to: builtin.SEEDAO_MINTER_ADDR,
      from: account,
      value: BigInt(0),
      // @ts-ignore
      data: buildWhitelistRegisterData(sns, ethers.utils.formatBytes32String(secret), proof),
    });
    return tx?.hash;
  };

  const handleTransaction = (action: TX_ACTION, data: any) => {
    const wallet = localStorage.getItem(SELECT_WALLET);
    if (action === TX_ACTION.COMMIT) {
      return handleCommit(wallet as Wallet, data);
    } else if (action === TX_ACTION.PAY_MINT) {
      return handleRegister(wallet as Wallet, data.sns, data.secret);
    } else if (action === TX_ACTION.WHITE_MINT) {
      return handleFreeMint(wallet as Wallet, data.sns, data.secret, data.proof);
    }
  };

  const approveToken = async () => {
    console.log('=======approveToken data=======', allowanceResult);
    if (!allowanceResult || allowanceResult < BigInt(PAY_NUMBER)) {
      await sendTransactionAsync({
        to: PAY_TOKEN.address,
        from: account,
        value: BigInt(0),
        // @ts-ignore
        data: buildApproveData(),
      });
    }
  };

  return { handleTransaction, approveToken };
}
