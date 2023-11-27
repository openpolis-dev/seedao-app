import styled from 'styled-components';
import { useSNSContext } from './snsProvider';

export default function StepLoading() {
  const {
    state: { step },
  } = useSNSContext();
  return (
    <Mask>
      <div>TODO: Loading... step {step}</div>
    </Mask>
  );
}

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;
