import { ethers } from 'ethers';
import { EstimateGasExecutionError, TransactionExecutionError } from 'viem';

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
  const iface = new ethers.utils.Interface(ERROR_ABI);
  const parsed = iface.parseError(data);
  console.log('parsed', parsed);
  return parsed;
};

const parseError = (error: Error) => {
  if (error instanceof EstimateGasExecutionError || error instanceof TransactionExecutionError) {
    console.log('cause', error.cause);
    console.log('details', error.details);
    console.log('metaMessages', error.metaMessages);
    console.log('shortMessage', error.shortMessage);
    if (error.details === 'execution reverted') {
      const metaMessage = error.metaMessages?.[1].split('\n') || [];
      console.log('====', metaMessage);
      const dataItemStr = metaMessage.find((m) => m.trimStart().startsWith('data:'))!.trim();
      const errData = dataItemStr.replace('data:', '').trim();
      console.log('>> dataItemStr', dataItemStr);
      console.log('>> errData', errData);
      const result = parseErrorData(errData);
      console.log('>> result', result);
      return result.name;
    } else {
      return error.shortMessage;
    }
  } else {
    return `${error}`;
  }
};

export default parseError;
