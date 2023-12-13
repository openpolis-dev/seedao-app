import React, { useReducer, createContext, useContext } from 'react';

export type LocalSNS = {
  [account: string]: {
    sns: string;
    step: 'commit' | 'register';
    stepStatus: 'pending' | 'success' | 'failed';
    secret: string;
    commitHash: string;
    registerHash: string;
    timestamp: number;
    tx?: any;
  };
};

export enum ACTIONS {
  SET_STEP = 'set_step',
  ADD_STEP = 'add_step',
  SET_CONTROLLER_CONTRACT = 'set_controller_contract',
  SET_MINTER_CONTRACT = 'set_minter_contract',
  SET_LOCAL_DATA = 'set_local_data',
  SHOW_LOADING = 'show_loading',
  CLOSE_LOADING = 'close_loading',
  SET_SNS = 'set_sns',
  SET_STORAGE = 'set_storage',
  SET_HAS_REACHED = 'set_has_reached',
  SET_USER_PROOF = 'set_user_proof',
  SET_HAD_MINT_BY_WHITELIST = 'set_had_mint_by_whitelist',
  SET_WHITELIST_IS_OPEN = 'set_whitelist_is_open',
  SET_MAX_OWNED_NUMBER = 'set_max_owned_number',
}

interface IState {
  step: number;
  controllerContract?: any;
  minterContract?: any;
  localData?: LocalSNS;
  loading?: boolean;
  sns: string;
  hasReached?: boolean;
  user_proof?: string[];
  hadMintByWhitelist?: boolean;
  whitelistNotOpen?: boolean;
  maxOwnedNumber: number;
}
interface IAction {
  type: ACTIONS;
  payload?: any;
}

const INIT_STATE: IState = { step: 0, sns: '', maxOwnedNumber: 1 };

const SNSContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ACTIONS.SET_SNS:
      return { ...state, sns: action.payload };
    case ACTIONS.ADD_STEP:
      return { ...state, step: state.step + 1 };
    case ACTIONS.SET_STEP:
      return { ...state, step: action.payload };
    case ACTIONS.SET_CONTROLLER_CONTRACT:
      return { ...state, controllerContract: action.payload };
    case ACTIONS.SET_MINTER_CONTRACT:
      return { ...state, minterContract: action.payload };
    case ACTIONS.SET_LOCAL_DATA:
      return { ...state, localData: action.payload };
    case ACTIONS.SHOW_LOADING:
      return { ...state, loading: true };
    case ACTIONS.CLOSE_LOADING:
      return { ...state, loading: false };
    case ACTIONS.SET_STORAGE:
      localStorage.setItem('sns', action.payload);
      return { ...state, localData: action.payload ? JSON.parse(action.payload) : undefined };
    case ACTIONS.SET_HAS_REACHED:
      return { ...state, hasReached: action.payload };
    case ACTIONS.SET_USER_PROOF:
      return { ...state, user_proof: action.payload };
    case ACTIONS.SET_HAD_MINT_BY_WHITELIST:
      return { ...state, hadMintByWhitelist: action.payload };
    case ACTIONS.SET_WHITELIST_IS_OPEN:
      return { ...state, whitelistNotOpen: action.payload };
    case ACTIONS.SET_MAX_OWNED_NUMBER:
      return { ...state, maxOwnedNumber: action.payload };
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
