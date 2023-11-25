import styled from 'styled-components';
import RegisterSNSStep1 from './step1';
import RegisterSNSStep2 from './step2';
import FinishedComponent from './finished';
import { ContainerPadding } from 'assets/styles/global';
import SNSProvider, { useSNSContext } from './snsProvider';

const RegisterSNSWrapper = () => {
  const {
    state: { step },
  } = useSNSContext();
  console.log('step', step);
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
