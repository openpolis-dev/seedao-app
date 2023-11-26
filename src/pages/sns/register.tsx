import styled from 'styled-components';
import RegisterSNSStep1 from './step1';
import RegisterSNSStep2 from './step2';
import FinishedComponent from './finished';
import { ContainerPadding } from 'assets/styles/global';
import SNSProvider, { ACTIONS, useSNSContext } from './snsProvider';
import { useAuthContext } from 'providers/authProvider';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import ABI from 'assets/abi/snsRegister.json';
const SNS_REGISTER_CONTRACT_ADDRESS = '0xded0a911F095349A071CA71Bb8237C4a40947159';

const RegisterSNSWrapper = () => {
  const {
    state: { account, provider },
  } = useAuthContext();

  const {
    state: { step, localData },
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
    const parseLocalData = () => {
      // if (!account) {
      //   return;
      // }
      // const localsns = localStorage.getItem('sns') || '';
      // let data = undefined;
      // try {
      //   data = JSON.parse(localsns);
      // } catch (error) { }
      // let data: LocalSNS = {
      //   [account]: {
      //     sns: 'lala',
      //     step: 'commit',
      //   },
      // };
      // if (data && data[account]) {
      //   const _d = data[account];
      //   if (_d.step === 'commit') {
      //     // TODO
      //   }
      // }
    };
    parseLocalData();
  }, [account, localData]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'sns' && event.newValue && JSON.stringify(localData) !== event.newValue) {
        dispatchSNS({ type: ACTIONS.SET_LOCAL_DATA, payload: JSON.parse(event.newValue) });
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [localData]);

  return (
    <Container>
      {step === 1 && <RegisterSNSStep1 />}
      {step === 2 && <RegisterSNSStep2 />}
      {step === 3 && <FinishedComponent />}
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
