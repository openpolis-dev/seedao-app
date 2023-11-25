import styled from 'styled-components';
import RegisterSNSStep1 from './step1';
import RegisterSNSStep2 from './step2';
import FinishedComponent from './finished';
import { ContainerPadding } from 'assets/styles/global';

import React, { useReducer, createContext, useContext } from 'react';

enum AppActionType {}

interface IState {
  step: number;
}
interface IAction {
  type: AppActionType;
  payload: any;
}

const INIT_STATE: IState = { step: 1 };

export const ACTIONS = {
  SET_STEP: 'set_step',
};

const SNSContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  //   TODO
  switch (action.type) {
    // TODO
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const SNSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  return <SNSContext.Provider value={{ state, dispatch }}>{children}</SNSContext.Provider>;
};

const useSNSContext = () => ({ ...useContext(SNSContext) });

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
