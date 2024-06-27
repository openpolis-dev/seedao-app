import React, { useReducer, createContext, useContext } from 'react';

export enum ACTIONS {
  SET_BOND_NFT_CONTRACT = 'SET_BOND_NFT_CONTRACT',
  SET_LEND_CONTRACT = 'SET_LEND_CONTRACT',
  SET_MY_DATA = 'SET_MY_DATA',
  SET_MY_SCORE = 'SET_MY_SCORE',
  SET_MY_QUOTA = 'SET_MY_QUOTA',
  SET_MAX_BORROW_DAYS = 'SET_MAX_BORROW_DAYS',
  SET_BORROW_RATE = 'SET_BORROW_RATE',
  SET_MIN_BORROW_COOL_DOWN = 'SET_MIN_BORROW_COOL_DOWN',
  SET_TOTAL_AVAILABLE_BORROW_AMOUNT = 'SET_TOTAL_AVAILABLE_BORROW_AMOUNT',
  SET_MIN_BORROW_AMOUNT = 'SET_MIN_BORROW_AMOUNT',
}

interface IState {
  bondNFTContract?: any;
  scoreLendContract?: any;
  myAvaliableQuota: number;
  myScore: number;
  myOverdueAmount: number;
  myOverdueCount: number;
  myInuseAmount: number;
  myInUseCount: number;
  maxBorrowDays: number;
  borrowRate: number;
  minBorrowCoolDown: number;
  totalAvaliableBorrowAmount: number;
  minBorrowAmount: number;
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
  myOverdueCount: 0,
  myInuseAmount: 0,
  myInUseCount: 0,
  maxBorrowDays: 0,
  borrowRate: 0,
  minBorrowCoolDown: 0,
  totalAvaliableBorrowAmount: 0,
  minBorrowAmount: 0,
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
        myOverdueAmount: action.payload.overdueAmount,
        myOverdueCount: action.payload.overdueCount,
        myInuseAmount: action.payload.inUseAmount,
        myInUseCount: action.payload.inUseCount,
      };
    case ACTIONS.SET_MY_QUOTA:
      return { ...state, myAvaliableQuota: action.payload };
    case ACTIONS.SET_MY_SCORE:
      return { ...state, myScore: action.payload };
    case ACTIONS.SET_MAX_BORROW_DAYS:
      return { ...state, maxBorrowDays: action.payload };
    case ACTIONS.SET_BORROW_RATE:
      return { ...state, borrowRate: action.payload };
    case ACTIONS.SET_MIN_BORROW_COOL_DOWN:
      return { ...state, minBorrowCoolDown: action.payload };
    case ACTIONS.SET_TOTAL_AVAILABLE_BORROW_AMOUNT:
      return { ...state, totalAvaliableBorrowAmount: action.payload };
    case ACTIONS.SET_MIN_BORROW_AMOUNT:
      return { ...state, minBorrowAmount: action.payload };
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
