import { ethers } from 'ethers';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useEffect } from 'react';
import { SBT_BOARDING } from 'utils/constant';
const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export default function CheckOnboarding() {
  const {
    state: { account, userData },
    dispatch,
  } = useAuthContext();

  useEffect(() => {
    if (!account || !userData) {
      return;
    }
    const provider = new ethers.providers.StaticJsonRpcProvider('https://polygon.llamarpc.com');
    const contract = new ethers.Contract(SBT_BOARDING, ABI, provider);
    contract.balanceOf(account, 157).then((r: any) => {
      dispatch({ type: AppActionType.SET_HAD_ONBOARDING, payload: r.toNumber() > 0 });
    });
  }, [account, userData]);
  return null;
}
