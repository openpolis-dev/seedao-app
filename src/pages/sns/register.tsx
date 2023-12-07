import styled from 'styled-components';
import RegisterSNSStep1 from './step1';
import RegisterSNSStep2 from './step2';
import FinishedComponent from './finished';
import { ContainerPadding } from 'assets/styles/global';
import SNSProvider, { ACTIONS, LocalSNS, useSNSContext } from './snsProvider';
import { useAuthContext } from 'providers/authProvider';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import StepLoading from './stepLoading';
import BackerNav from 'components/common/backNav';
import ABI from 'assets/abi/snsRegister.json';
import { builtin } from '@seedao/sns-js';
import getConfig from 'utils/envCofnig';
import { Wallet } from 'wallet/wallet';
import { SELECT_WALLET } from 'utils/constant';
const networkConfig = getConfig().NETWORK;

const RegisterSNSWrapper = () => {
  const {
    state: { account, provider },
  } = useAuthContext();

  const {
    state: { step, localData, loading },
    dispatch: dispatchSNS,
  } = useSNSContext();

  console.log('step', step);

  useEffect(() => {
    console.log('222provider', provider);
    const initContract = async () => {
      // check network
      if (!provider?.getNetwork) {
        return;
      }
      const network = await provider.getNetwork();
      const wallet = localStorage.getItem(SELECT_WALLET);

      if (network?.chainId !== networkConfig.chainId) {
        // switch network;
        try {
          await provider.send('wallet_switchEthereumChain', [
            { chainId: ethers.utils.hexValue(networkConfig.chainId) },
          ]);
          return;
        } catch (error) {
          console.error('switch network error', error);
          return;
        }
      }
      console.log('signer', provider.getSigner(account));
      const _contract = new ethers.Contract(
        networkConfig.SEEDAO_REGISTRAR_CONTROLLER_ADDR,
        ABI,
        provider.getSigner(account),
      );
      dispatchSNS({ type: ACTIONS.SET_CONTRACT, payload: _contract });
    };
    provider && initContract();
  }, [provider, provider?.getNetwork]);

  useEffect(() => {
    console.log('account', account);
    console.log('localData', localData);
    if (!localData) {
      const localsns = localStorage.getItem('sns') || '';
      let data: LocalSNS;
      try {
        data = JSON.parse(localsns);
      } catch (error) {
        dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
        return;
      }
      dispatchSNS({ type: ACTIONS.SET_LOCAL_DATA, payload: data });
      if (!account || !data || !data[account]) {
        dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
      }
    }
  }, [account, localData]);

  useEffect(() => {
    const parseLocalData = () => {
      if (!account || !localData) {
        return;
      }
      const v = localData[account];
      if (!v) {
        return;
      }
      dispatchSNS({ type: ACTIONS.SET_SNS, payload: v.sns });
      // check step

      console.log('v:', v);
      if (v.step === 'commit') {
        console.log('timestamp', v.timestamp);
        if (v.timestamp > 0) {
          dispatchSNS({ type: ACTIONS.SET_STEP, payload: 2 });
          return;
        } else {
          dispatchSNS({ type: ACTIONS.SHOW_LOADING });
        }
      } else if (v.step === 'register') {
        if (v.stepStatus === 'success') {
          dispatchSNS({ type: ACTIONS.SET_STEP, payload: 3 });
          return;
        } else {
          dispatchSNS({ type: ACTIONS.SET_STEP, payload: 2 });
          if (v.stepStatus === 'pending') {
            dispatchSNS({ type: ACTIONS.SHOW_LOADING });
          }
          return;
        }
      }
      dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
    };
    parseLocalData();
  }, [account, localData]);

  return (
    <Container>
      <BackerNav to="/home" title="SNS" mb="0" />
      <StepContainer>
        {step === 1 && <RegisterSNSStep1 />}
        {step === 2 && <RegisterSNSStep2 />}
        {step === 3 && <FinishedComponent />}
      </StepContainer>
      {loading && <StepLoading />}
    </Container>
  );
};

export default function RegisterSNS() {
  return (
    <SNSProvider>
      <RegisterSNSWrapper />
    </SNSProvider>
  );
}

const Container = styled.div`
  ${ContainerPadding};
  min-height: 100%;
`;

const StepContainer = styled.div`
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
