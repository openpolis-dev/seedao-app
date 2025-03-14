import { BigNumber, ethers } from 'ethers';
import { useAuthContext } from 'providers/authProvider';
import { erc20ABI, useSendTransaction, Address, useSwitchNetwork, useNetwork } from 'wagmi';
import { prepareSendTransaction, readContract } from 'wagmi/actions';
import { Hex } from 'viem';
import ScoreLendABI from 'assets/abi/ScoreLend.json';
import { useEthersProvider } from 'hooks/ethersNew';

import getConfig from 'utils/envCofnig';
const networkConfig = getConfig().NETWORK;

const lendToken = networkConfig.lend.lendToken;
const lendChain = networkConfig.lend.chain;

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
          r.status === 1 ? resolve(r) : reject(r);
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

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const checkNetwork = async () => {
    if (chain && switchNetworkAsync && chain?.id !== lendChain.id) {
      await switchNetworkAsync(lendChain.id);
      return;
    }
  };

  const { sendTransactionAsync } = useSendTransaction();
  const provider = useEthersProvider({});

  const handleBorrow = async (amount: number, gas: bigint | undefined) => {
    if (gas) {
      console.log('use gas:', Math.ceil(Number(gas) * 1.2));
    }
    const tx = await sendTransactionAsync({
      to: networkConfig.lend.scoreLendContract,
      account: account as Address,
      value: BigInt(0),
      data: buildBorrowData(amount) as Hex,
      gas: gas ? BigInt(Math.ceil(Number(gas) * 1.2)) : undefined,
    });
    return checkTransaction(provider, tx?.hash);
  };
  const handleRepay = async (ids: number[], gas: bigint | undefined) => {
    if (gas) {
      console.log('use gas:', Math.ceil(Number(gas) * 1.2));
    }
    const tx = await sendTransactionAsync({
      to: networkConfig.lend.scoreLendContract,
      account: account as Address,
      value: BigInt(0),
      data: buildRepayData(ids) as Hex,
      gas: gas ? BigInt(Math.ceil(Number(gas) * 1.2)) : undefined,
    });
    return checkTransaction(provider, tx?.hash);
  };

  const handleTransaction = (action: TX_ACTION, data: number | number[], gas: bigint | undefined) => {
    if (action === TX_ACTION.BORROW) {
      return handleBorrow(data as number, gas);
    } else if (action === TX_ACTION.REPAY) {
      return handleRepay(data as number[], gas);
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

  const getAllowanceEnough = async (token: 'lend' | 'scr', amount: number) => {
    const address = token === 'lend' ? lendToken.address : networkConfig.SCRContract.address;
    const decimals = token === 'lend' ? lendToken.decimals : networkConfig.SCRContract.decimals;
    const allowanceResult = await readContract({
      address: address as Address,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [account as Address, networkConfig.lend.scoreLendContract as Address],
    });
    console.log('=======approveToken allowance=======', allowanceResult);
    return (
      !!allowanceResult &&
      ethers.BigNumber.from(allowanceResult.toString()).gte(ethers.utils.parseUnits(String(amount), decimals))
    );
  };

  const approveToken = async (token: 'lend' | 'scr', amount: number) => {
    const address = token === 'lend' ? lendToken.address : networkConfig.SCRContract.address;
    const decimals = token === 'lend' ? lendToken.decimals : networkConfig.SCRContract.decimals;
    const allowanceResult = await readContract({
      address: address as Address,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [account as Address, networkConfig.lend.scoreLendContract as Address],
    });
    console.log('=======approveToken allowance=======', allowanceResult);
    if (
      !allowanceResult ||
      ethers.BigNumber.from(allowanceResult.toString()).lt(ethers.utils.parseUnits(String(amount), decimals))
    ) {
      const tx = await sendTransactionAsync({
        to: address,
        account: account as Address,
        value: BigInt(0),
        data: token === 'lend' ? (buildApproveLendTokenData(amount) as Hex) : (buildApproveScoreData(amount) as Hex),
      });
      return checkTransaction(provider, tx.hash);
    }
  };

  const checkEnoughBalance = async (account: string, token: 'lend' | 'scr', amount: number) => {
    const address = token === 'lend' ? lendToken.address : networkConfig.SCRContract.address;
    const balance = await readContract({
      address: address as Address,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [account as Address],
    });
    return ethers.BigNumber.from(balance.toString()).gte(
      ethers.utils.parseUnits(
        String(amount),
        token === 'lend' ? lendToken.decimals : networkConfig.SCRContract.decimals,
      ),
    );
  };

  const getTokenBalance = async (token: 'lend' | 'scr') => {
    const address = token === 'lend' ? lendToken.address : networkConfig.SCRContract.address;
    const balance = await readContract({
      address: address as Address,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [account as Address],
    });
    return ethers.BigNumber.from(balance.toString());
  };

  const getTokenAllowance = async (token: 'lend' | 'scr') => {
    const address = token === 'lend' ? lendToken.address : networkConfig.SCRContract.address;
    const allowanceResult = await readContract({
      address: address as Address,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [account as Address, networkConfig.lend.scoreLendContract as Address],
    });
    console.log('=======approveToken allowance=======', allowanceResult);
    return ethers.BigNumber.from(allowanceResult.toString());
  };

  return {
    checkNetwork,
    handleTransaction,
    approveToken,
    handleEstimateGas,
    checkEnoughBalance,
    getAllowanceEnough,
    getTokenBalance,
    getTokenAllowance,
  };
}
