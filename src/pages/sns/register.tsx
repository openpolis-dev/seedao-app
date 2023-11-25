import RegisterSNSStep1 from './step1';
import RegisterSNSStep2 from './step2';

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
    <>
      <RegisterSNSStep1 />
      <RegisterSNSStep2 />
    </>
  );
};

export default function RegisterSNS() {
  return (
    <SNSProvider>
      <RegisterSNSWrapper />
    </SNSProvider>
  );
}
