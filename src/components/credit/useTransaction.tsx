import { ethers } from 'ethers';
import { useAuthContext } from 'providers/authProvider';
import { erc20ABI, useSendTransaction, Address } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';
import { prepareSendTransaction, readContract } from 'wagmi/actions';
import { Hex } from 'viem';
import ScoreLendABI from 'assets/abi/ScoreLend.json';

import getConfig from 'utils/envCofnig';
const networkConfig = getConfig().NETWORK;

const lendToken = networkConfig.lend.lendToken;

export enum TX_ACTION {
  BORROW = 'borrow',
  REPAY = 'REPAY',
}

const checkTransaction = (provider: any, hash: string | Hex) => {
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      provider.getTransactionReceipt?.(hash).then((r: any) => {
        console.log('check tx result', r);
        if (r) {
          clearInterval(timer);
          resolve(r);
        }
      });
    }, 5000);
  });
};

const buildApproveScoreData = (num: number) => {
  const iface = new ethers.utils.Interface(erc20ABI);
  return iface.encodeFunctionData('approve', [
    networkConfig.lend.scoreLendContract,
    ethers.utils.parseUnits(String(num), networkConfig.SCRContract.decimals),
  ]);
};

const buildApproveLendTokenData = (num: number) => {
  const iface = new ethers.utils.Interface(erc20ABI);
  return iface.encodeFunctionData('approve', [
    networkConfig.lend.scoreLendContract,
    ethers.utils.parseUnits(String(num), lendToken.decimals),
  ]);
};

const buildBorrowData = (amount: number) => {
  const iface = new ethers.utils.Interface(ScoreLendABI);
  const amountNB = ethers.utils.parseUnits(String(amount), lendToken.decimals);
  return iface.encodeFunctionData('borrow', [amountNB]);
};

const buildRepayData = (ids: number[]) => {
  const iface = new ethers.utils.Interface(ScoreLendABI);
  return iface.encodeFunctionData('paybackBatch', [ids]);
};
export default function useTransaction() {
  const {
    state: { account },
  } = useAuthContext();

  const { sendTransactionAsync } = useSendTransaction();

  const handleBorrow = async (provider: any, amount: number) => {
    const tx = await sendTransactionAsync({
      to: networkConfig.lend.scoreLendContract,
      account: account as Address,
      value: BigInt(0),
      data: buildBorrowData(amount) as Hex,
    });
    return checkTransaction(provider, tx?.hash);
  };
  const handleRepay = async (provider: any, ids: number[]) => {
    const tx = await sendTransactionAsync({
      to: networkConfig.lend.scoreLendContract,
      account: account as Address,
      value: BigInt(0),
      data: buildRepayData(ids) as Hex,
    });
    return checkTransaction(provider, tx?.hash);
  };

  const handleTransaction = (provider: any, action: TX_ACTION, data: number | number[]) => {
    if (action === TX_ACTION.BORROW) {
      return handleBorrow(provider, data as number);
    } else if (action === TX_ACTION.REPAY) {
      return handleRepay(provider, data as number[]);
    }
  };
  const handleEsitmateBorrow = (amount: number) => {
    return prepareSendTransaction({
      account: account as Address,
      to: networkConfig.lend.scoreLendContract,
      data: buildBorrowData(amount) as Hex,
    });
  };
  const handleEsitmateRepay = (ids: number[]) => {
    return prepareSendTransaction({
      account: account as Address,
      to: networkConfig.lend.scoreLendContract,
      data: buildRepayData(ids) as Hex,
    });
  };

  const handleEstimateGas = async (action: TX_ACTION, data: any) => {
    if (action === TX_ACTION.BORROW) {
      return handleEsitmateBorrow(data);
    } else if (action === TX_ACTION.REPAY) {
      return handleEsitmateRepay(data);
    }
  };

  const approveToken = async (token: 'usdt' | 'scr', amount: number) => {
    const address = token === 'usdt' ? lendToken.address : networkConfig.SCRContract.address;
    const allowanceResult = await readContract({
      address: address as Address,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [account as Address, networkConfig.lend.scoreLendContract as Address],
    });
    console.log('=======approveToken allowance=======', allowanceResult);
    if (!allowanceResult || allowanceResult < BigInt(amount)) {
      const tx = await sendTransactionAsync({
        to: address,
        account: account as Address,
        value: BigInt(0),
        data: token === 'usdt' ? (buildApproveLendTokenData(amount) as Hex) : (buildApproveScoreData(amount) as Hex),
      });
      return await waitForTransaction({ hash: tx.hash });
    }
  };

  const checkEnoughBalance = async (account: string, token: 'usdt' | 'scr', amount: number) => {
    const address = token === 'usdt' ? lendToken.address : networkConfig.SCRContract.address;
    const balance = await readContract({
      address: address as Address,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [account as Address],
    });
    return balance >= BigInt(amount);
  };

  return { handleTransaction, approveToken, handleEstimateGas, checkEnoughBalance };
}
