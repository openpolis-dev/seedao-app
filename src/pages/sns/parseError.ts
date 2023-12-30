import { EstimateGasExecutionError, TransactionExecutionError, RpcRequestError } from 'viem';
import { decodeErrorResult } from 'viem';

const ERROR_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'CommitmentTooNew',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'CommitmentTooOld',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'max',
        type: 'uint256',
      },
    ],
    name: 'ReachedMaxOwnedNumberLimit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientPayment',
    type: 'error',
  },
];

const parseErrorData = (data: any) => {
  // @ts-ignore
  const parsed = decodeErrorResult({
    abi: ERROR_ABI,
    data,
  });
  console.log('parsed', parsed);
  return parsed;
};

const parseError = (error: Error) => {
  if (error instanceof EstimateGasExecutionError || error instanceof TransactionExecutionError) {
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
