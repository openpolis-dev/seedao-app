import React, { useReducer, createContext, useContext, useEffect, useCallback } from 'react';
import { IUser } from 'type/user.type';
import { ICategory } from 'type/proposal.type';
import { SEEDAO_USER } from 'utils/constant';

interface IState {
  account?: string;
  show_login_modal?: boolean;
  userData?: IUser;
  proposal_categories: ICategory[];
  language: string | null;
  loading: boolean | null;
}

export enum AppActionType {
  SET_ACCOUNT = 'set_account',
  SET_LOGIN_MODAL = 'set_login_modal',
  SET_USER_DATA = 'set_user_data',
  CLEAR_AUTH = 'clear_auth',
  SET_PROPOSAL_CATEGORIES = 'set_proposal_categories',
  SET_LAN = 'SET_LAN',
  SET_LOADING = 'SET_LOADING',
}

interface IAction {
  type: AppActionType;
  payload: any;
}

const INIT_STATE: IState = { show_login_modal: false, proposal_categories: [], language: null, loading: null };

const AuthContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case AppActionType.SET_ACCOUNT:
      return { ...state, account: action.payload };
    case AppActionType.SET_LOGIN_MODAL:
      return { ...state, show_login_modal: action.payload };
    case AppActionType.SET_USER_DATA:
      localStorage.setItem(SEEDAO_USER, JSON.stringify(action.payload));
      return { ...state, userData: action.payload };
    case AppActionType.CLEAR_AUTH:
      localStorage.removeItem(SEEDAO_USER);
      return { ...state, account: undefined, userData: undefined };
    case AppActionType.SET_PROPOSAL_CATEGORIES:
      return { ...state, proposal_categories: action.payload };
    case AppActionType.SET_LOADING:
      return { ...state, loading: action.payload };

    case AppActionType.SET_LAN:
      return { ...state, language: action.payload };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  console.log('=====state', state);
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => ({ ...useContext(AuthContext) });

export default AuthProvider;
