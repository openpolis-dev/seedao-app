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
import ABI from 'assets/abi/snsRegister.json';
const SNS_REGISTER_CONTRACT_ADDRESS = '0xded0a911F095349A071CA71Bb8237C4a40947159';

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
    if (provider) {
      const _contract = new ethers.Contract(SNS_REGISTER_CONTRACT_ADDRESS, ABI, provider.getSigner());
      dispatchSNS({ type: ACTIONS.SET_CONTRACT, payload: _contract });
    }
  }, [provider]);

  useEffect(() => {
    console.log('account', account);
    console.log('localData', localData);
    if (account && !localData) {
      const localsns = localStorage.getItem('sns') || '';
      let data: LocalSNS;
      try {
        data = JSON.parse(localsns);
      } catch (error) {
        dispatchSNS({ type: ACTIONS.SET_STEP, payload: 1 });
        return;
      }
      dispatchSNS({ type: ACTIONS.SET_LOCAL_DATA, payload: data });
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
      {step === 1 && <RegisterSNSStep1 />}
      {step === 2 && <RegisterSNSStep2 />}
      {step === 3 && <FinishedComponent />}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;
