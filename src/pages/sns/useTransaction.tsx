import { sendTransaction } from '@joyid/evm';
import { useSNSContext } from './snsProvider';
import { SELECT_WALLET } from 'utils/constant';
import { Wallet } from 'wallet/wallet';
import { ethers } from 'ethers';
import CONTROLLER_ABI from 'assets/abi/SeeDAORegistrarController.json';
import REGISTER_ABI from 'assets/abi/SeeDAOMinter.json';
import { builtin } from '@seedao/sns-js';
import { useAuthContext } from 'providers/authProvider';
import { erc20ABI } from 'wagmi';
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

const buildWhitelistRegisterData = (sns: string, secret: string, whitelistId: number, proof: string) => {
  const iface = new ethers.utils.Interface(REGISTER_ABI);
  return iface.encodeFunctionData('registerWithWhitelist', [
    sns,
    builtin.PUBLIC_RESOLVER_ADDR,
    secret,
    whitelistId,
    proof,
  ]);
};

export default function useTransaction() {
  const {
    state: { account, provider, rpc },
  } = useAuthContext();
  const {
    state: { minterContract, controllerContract },
  } = useSNSContext();

  const handleCommit = async (wallet: Wallet, commitment: string) => {
    if (wallet === Wallet.JOYID_WEB) {
      return await sendTransaction(
        {
          to: builtin.SEEDAO_REGISTRAR_CONTROLLER_ADDR,
          from: account,
          value: '0',
          data: buildCommitData(commitment),
        },
        account,
        {
          rpcURL: rpc || networkConfig.rpcs[0],
        },
      );
    } else {
      const tx = await controllerContract.commit(commitment);
      return tx?.hash;
    }
  };

  const handleRegister = async (wallet: Wallet, sns: string, secret: string) => {
    if (wallet === Wallet.JOYID_WEB) {
      return await sendTransaction(
        {
          to: builtin.SEEDAO_MINTER_ADDR,
          from: account,
          value: '0',
          data: buildRegisterData(sns, ethers.utils.formatBytes32String(secret)),
        },
        account,
        {
          rpcURL: rpc || networkConfig.rpcs[0],
        },
      );
    } else {
      const tx = await minterContract.register(
        sns,
        builtin.PUBLIC_RESOLVER_ADDR,
        ethers.utils.formatBytes32String(secret),
        PAY_TOKEN.address,
      );
      return tx?.hash;
    }
  };

  const handleFreeMint = async (wallet: Wallet, sns: string, secret: string, whitelistId: number, proof: string) => {
    if (wallet === Wallet.JOYID_WEB) {
      return await sendTransaction(
        {
          to: builtin.SEEDAO_MINTER_ADDR,
          from: account,
          value: '0',
          data: buildWhitelistRegisterData(sns, ethers.utils.formatBytes32String(secret), whitelistId, proof),
        },
        account,
        {
          rpcURL: rpc || networkConfig.rpcs[0],
        },
      );
    } else {
      const tx = await minterContract.registerWithWhitelist(
        sns,
        builtin.PUBLIC_RESOLVER_ADDR,
        ethers.utils.formatBytes32String(secret),
        whitelistId,
        proof,
      );
      return tx?.hash;
    }
  };

  const handleTransaction = (action: TX_ACTION, data: any) => {
    const wallet = localStorage.getItem(SELECT_WALLET);
    if (action === TX_ACTION.COMMIT) {
      return handleCommit(wallet as Wallet, data);
    } else if (action === TX_ACTION.PAY_MINT) {
      return handleRegister(wallet as Wallet, data.sns, data.secret);
    } else if (action === TX_ACTION.WHITE_MINT) {
      return handleFreeMint(wallet as Wallet, data.sns, data.secret, data.whitelistId, data.proof);
    }
  };

  const approveToken = async () => {
    const wallet = localStorage.getItem(SELECT_WALLET);
    const tokenContract = new ethers.Contract(PAY_TOKEN.address, erc20ABI, provider.getSigner(account));
    // check approve balance
    const approve_balance = await tokenContract.allowance(account, builtin.SEEDAO_MINTER_ADDR);
    const not_enough = approve_balance.lt(ethers.utils.parseUnits(String(PAY_NUMBER), PAY_TOKEN.decimals));
    if (wallet === Wallet.JOYID_WEB) {
      if (not_enough) {
        await sendTransaction({
          to: PAY_TOKEN.address,
          from: account,
          value: '0',
          data: buildApproveData(),
        });
      }
    } else {
      if (not_enough) {
        // approve
        const tx = await tokenContract.approve(
          builtin.SEEDAO_MINTER_ADDR,
          ethers.utils.parseUnits(String(PAY_NUMBER), PAY_TOKEN.decimals),
        );
        await tx.wait();
      }
    }
  };

  return { handleTransaction, approveToken };
}
