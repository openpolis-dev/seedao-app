import getConfig from 'utils/envCofnig';
import { Address } from 'wagmi';
import { fetchBalance } from 'wagmi/actions';
import { parseUnits } from 'viem';

const networkConfig = getConfig().NETWORK;
const PAY_TOKEN = networkConfig.tokens[0];
const PAY_NUMBER = PAY_TOKEN.price;

export const checkTokenBalance = async (account: Address) => {
  const balance = await fetchBalance({
    token: PAY_TOKEN.address as Address,
    address: account as Address,
  });
  if (balance.value < parseUnits(String(PAY_NUMBER), PAY_TOKEN.decimals)) {
    return PAY_TOKEN.name;
  }
};

export const checkNativeTokenBalance = async (account: Address, gasFee: bigint) => {
  const balance = await fetchBalance({
    address: account as Address,
  });
  if (balance.value < gasFee) {
    return networkConfig.nativeToken;
  }
};

export const checkEstimateGasFeeEnough = async (estimateResult: any, account: Address) => {
  try {
    let fee: BigInt = BigInt(0);
    if (estimateResult?.gas && estimateResult?.gasPrice) {
      fee = BigInt(estimateResult.gas * estimateResult.gasPrice);
    }
    const token = await checkNativeTokenBalance(account, fee.valueOf());
    return token;
  } catch (error) {
    // check failed, but not influnce the next step, no need to throw error or stop;
    logError('check native balance error', error);
  }
};
