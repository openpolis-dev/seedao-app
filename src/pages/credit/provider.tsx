import React, { useReducer, createContext, useContext } from 'react';

export enum ACTIONS {
  SET_BOND_NFT_CONTRACT = 'SET_BOND_NFT_CONTRACT',
  SET_LEND_CONTRACT = 'SET_LEND_CONTRACT',
  SET_MY_DATA = 'SET_MY_DATA',
  SET_MY_SCORE = 'SET_MY_SCORE',
}

interface IState {
  bondNFTContract?: any;
  scoreLendContract?: any;
  myAvaliableQuota: number;
  myScore: number;
  myOverdueAmount: number;
  myInuseAmount: number;
}
interface IAction {
  type: ACTIONS;
  payload?: any;
}

const INIT_STATE: IState = {
  bondNFTContract: undefined,
  scoreLendContract: undefined,
  myAvaliableQuota: 0,
  myScore: 0,
  myOverdueAmount: 0,
  myInuseAmount: 0,
};

const CreditContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTIONS.SET_BOND_NFT_CONTRACT:
      return { ...state, bondNFTContract: action.payload };
    case ACTIONS.SET_LEND_CONTRACT:
      return { ...state, scoreLendContract: action.payload };
    case ACTIONS.SET_MY_DATA:
      return {
        ...state,
        myAvaliableQuota: action.payload.availableAmount,
        myOverdueAmount: action.payload.overdueAmount,
        myInuseAmount: action.payload.inUseAmount,
      };
    case ACTIONS.SET_MY_SCORE:
      return { ...state, myScore: action.payload };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  return <CreditContext.Provider value={{ state, dispatch }}>{children}</CreditContext.Provider>;
};

export const useCreditContext = () => ({ ...useContext(CreditContext) });

export default CreditProvider;
