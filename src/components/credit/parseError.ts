import {
  EstimateGasExecutionError,
  TransactionExecutionError,
  RpcRequestError,
  ContractFunctionExecutionError,
} from 'viem';
import { decodeErrorResult } from 'viem';
import ScoreLendABI from 'assets/abi/ScoreLend.json';

const parseErrorData = (data: any) => {
  // @ts-ignore
  const parsed = decodeErrorResult({
    abi: ScoreLendABI,
    data,
  });
  console.log('parsed', parsed);
  return parsed;
};

const parseError = (error: Error) => {
  if (error instanceof ContractFunctionExecutionError) {
    return error.shortMessage;
  }
  if (error instanceof EstimateGasExecutionError || error instanceof TransactionExecutionError) {
    if (error.details === 'User Rejected') {
      // Joyid will show this error message
      return error.details;
    }
    if (error.details === 'execution reverted') {
      const rpc_error = error.walk((e) => e instanceof RpcRequestError);
      if (rpc_error) {
        // @ts-ignore
        const result = parseErrorData(rpc_error.cause.data);
        return result.errorName;
      } else {
        return error.shortMessage;
      }
    } else {
      return error.shortMessage;
    }
  } else {
    return `${error}`;
  }
};

export default parseError;
