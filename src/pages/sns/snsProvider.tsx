import React, { useReducer, createContext, useContext } from 'react';

export type LocalSNS = {
  [account: string]: {
    sns: string;
    step: 'commit' | 'register';
    tx?: any;
  };
};

export enum ACTIONS {
  SET_STEP = 'set_step',
  ADD_STEP = 'add_step',
  SET_CONTRACT = 'set_contract',
  SET_LOCAL_DATA = 'set_local_data',
}

interface IState {
  step: number;
  contract?: any;
  localData?: LocalSNS;
}
interface IAction {
  type: ACTIONS;
  payload: any;
}

const INIT_STATE: IState = { step: 1 };

const SNSContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTIONS.ADD_STEP:
      return { ...state, step: state.step + 1 };
    case ACTIONS.SET_CONTRACT:
      return { ...state, contract: action.payload };
    case ACTIONS.SET_LOCAL_DATA:
      return { ...state, localData: action.payload };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const SNSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  return <SNSContext.Provider value={{ state, dispatch }}>{children}</SNSContext.Provider>;
};

export const useSNSContext = () => ({ ...useContext(SNSContext) });

export default SNSProvider;
