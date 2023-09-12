import React, { useReducer, createContext, useContext } from 'react';
import { IUser, ITokenType } from 'type/user.type';
import { ICategory } from 'type/proposal.type';
import { Authorizer } from 'casbin.js';
import { SEEDAO_USER, SEEDAO_USER_DATA, SENDING_ME_USER } from '../utils/constant';
import { WalletType } from '../wallet/wallet';

interface IState {
  account?: string;
  show_login_modal?: boolean;
  userData?: IUser;
  tokenData?: ITokenType;
  proposal_categories: ICategory[];
  language: string;
  loading: boolean | null;
  authorizer?: Authorizer;
  wallet_type?: WalletType;
  expandMenu: boolean;
}

export enum AppActionType {
  SET_ACCOUNT = 'set_account',
  SET_LOGIN_MODAL = 'set_login_modal',
  SET_USER_DATA = 'set_user_data',
  SET_LOGIN_DATA = 'set_login_data',
  CLEAR_AUTH = 'clear_auth',
  SET_PROPOSAL_CATEGORIES = 'set_proposal_categories',
  SET_LAN = 'SET_LAN',
  SET_LOADING = 'SET_LOADING',
  SET_AUTHORIZER = 'SET_AUTHORIZER',
  SET_WALLET_TYPE = 'set_wallet_type',
  SET_EXPAND_MENU = 'set_expand_menu',
}

interface IAction {
  type: AppActionType;
  payload: any;
}

const INIT_STATE: IState = {
  expandMenu: true,
  show_login_modal: false,
  proposal_categories: [
    {
      category_id: 19,
      id: 2785,
      group_id: 4649,
      name: '3 层提案专区',
      thread_count: 0,
      post_count: 0,
      can_see: 1,
      children: [
        { category_id: 12, id: 2483, group_id: 4649, name: 'P3 提案', thread_count: 0, post_count: 0, can_see: 1 },
        { category_id: 9, id: 2272, group_id: 4649, name: 'P2 提案', thread_count: 0, post_count: 0, can_see: 1 },
        { category_id: 14, id: 2485, group_id: 4649, name: 'P1 提案', thread_count: 0, post_count: 0, can_see: 1 },
      ],
    },
  ],
  language: 'en',
  loading: null,
};

const AuthContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case AppActionType.SET_EXPAND_MENU:
      return { ...state, expandMenu: action.payload };
    case AppActionType.SET_ACCOUNT:
      return { ...state, account: action.payload };
    case AppActionType.SET_LOGIN_MODAL:
      return { ...state, show_login_modal: action.payload };
    case AppActionType.SET_USER_DATA:
      localStorage.setItem(SEEDAO_USER_DATA, JSON.stringify(action.payload));
      return { ...state, userData: action.payload };
    case AppActionType.SET_LOGIN_DATA:
      localStorage.setItem(SEEDAO_USER, JSON.stringify(action.payload));
      localStorage.setItem(SEEDAO_USER_DATA, JSON.stringify(action.payload?.user));
      const tokenData = { token: action.payload?.token, token_exp: action.payload?.token_exp };
      return {
        ...state,
        userData: action.payload?.user,
        tokenData: tokenData,
      };
    case AppActionType.CLEAR_AUTH:
      localStorage.removeItem(SEEDAO_USER);
      localStorage.removeItem(SENDING_ME_USER);
      return { ...state, account: undefined, userData: undefined, wallet_type: undefined, authorizer: undefined };
    case AppActionType.SET_PROPOSAL_CATEGORIES:
      return { ...state, proposal_categories: action.payload };
    case AppActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case AppActionType.SET_AUTHORIZER:
      return { ...state, authorizer: action.payload };

    case AppActionType.SET_LAN:
      return { ...state, language: action.payload };
    case AppActionType.SET_WALLET_TYPE:
      return { ...state, wallet_type: action.payload };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => ({ ...useContext(AuthContext) });

export default AuthProvider;
