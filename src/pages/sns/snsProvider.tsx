import React, { useReducer, createContext, useContext } from 'react';

export enum ACTIONS {
  SET_STEP = 'set_step',
  ADD_STEP = 'add_step',
  SET_CONTRACT = 'set_contract',
}

interface IState {
  step: number;
  contract?: any;
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
