import React, { useReducer, createContext, useContext } from 'react';
import { IUser, ITokenType } from 'type/user.type';
import { ICategory } from 'type/proposal.type';
import { IBaseCategory, ICategoryWithTemplates } from 'type/proposalV2.type';
import { Authorizer } from 'casbin.js';
import {
  SEEDAO_ACCOUNT,
  SEEDAO_USER,
  SEEDAO_USER_DATA,
  SENDING_ME_USER,
  METAFORO_TOKEN,
  SEE_AUTH,
} from '../utils/constant';
import { WalletType } from '../wallet/wallet';
import getConfig from 'utils/envCofnig';

interface IState {
  account?: string;
  show_login_modal?: boolean;
  userData?: IUser;
  sns?: string;
  tokenData?: ITokenType;
  proposal_categories: ICategory[];
  proposalCategories?: IBaseCategory[];
  categoryTemplates: ICategoryWithTemplates[];
  language: string;
  loading: boolean | null;
  authorizer?: Authorizer;
  wallet_type?: WalletType;
  expandMenu: boolean;
  provider?: any;
  theme: boolean;
  snsMap: Map<string, string>;
  hadOnboarding?: boolean;
  currentSeason: string;
  rpc?: string;
  metaforoToken?: string;
  show_metaforo_login?: boolean;
  deschoolToken?: string;
  userMap: Map<string, any>;
}

export enum AppActionType {
  SET_ACCOUNT = 'set_account',
  SET_LOGIN_MODAL = 'set_login_modal',
  SET_USER_DATA = 'set_user_data',
  SET_LOGIN_DATA = 'set_login_data',
  CLEAR_AUTH = 'clear_auth',
  SET_PROPOSAL_CATEGORIES = 'set_proposal_categories',
  SET_PROPOSAL_CATEGORIES_V2 = 'set_proposal_categories_v2',
  SET_CATEGORIES_TEMPLATES = 'set_categories_templates',
  SET_LAN = 'SET_LAN',
  SET_LOADING = 'SET_LOADING',
  SET_AUTHORIZER = 'SET_AUTHORIZER',
  SET_WALLET_TYPE = 'set_wallet_type',
  SET_EXPAND_MENU = 'set_expand_menu',
  SET_PROVIDER = 'set_provider',
  SET_RPC = 'set_rpc',
  SET_THEME = 'set_theme',
  SET_SNS_MAP = 'set_sns_map',
  SET_SNS = 'set_sns',
  SET_HAD_ONBOARDING = 'set_had_onboarding',
  SET_CURRENT_SEASON = 'set_current_season',
  SET_METAFORO_TOKEN = 'set_metaforo_token',
  SET_SHOW_METAFORO_LOGIN_MODAL = 'set_show_metaforo_login_modal',
  SET_THIRD_PARTY_TOKEN = 'set_third_party_token',
  SET_USER_MAP = 'set_user_map',
}

interface IAction {
  type: AppActionType;
  payload: any;
}

const INIT_STATE: IState = {
  expandMenu: true,
  show_login_modal: false,
  theme: document.documentElement.getAttribute('data-bs-theme') === 'dark',
  proposal_categories: [
    // {
    //   category_id: 19,
    //   id: 2785,
    //   group_id: 4649,
    //   name: '3 层提案专区',
    //   thread_count: 0,
    //   post_count: 0,
    //   can_see: 1,
    //   children: [
    //     { category_id: 12, id: 2483, group_id: 4649, name: 'P3 提案', thread_count: 0, post_count: 0, can_see: 1 },
    //     { category_id: 9, id: 2272, group_id: 4649, name: 'P2 提案', thread_count: 0, post_count: 0, can_see: 1 },
    //     { category_id: 14, id: 2485, group_id: 4649, name: 'P1 提案', thread_count: 0, post_count: 0, can_see: 1 },
    //   ],
    // },
  ],
  proposalCategories: undefined ,
  categoryTemplates: [],
  language: '',
  loading: null,
  snsMap: new Map(),
  currentSeason: '',
  userMap: new Map(),
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
      localStorage.setItem(SEEDAO_ACCOUNT, action.payload);
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
      localStorage.removeItem(METAFORO_TOKEN);
      localStorage.removeItem(SEE_AUTH);
      return {
        ...state,
        account: undefined,
        userData: undefined,
        wallet_type: undefined,
        authorizer: undefined,
        metaforoToken: undefined,
      };
    case AppActionType.SET_PROPOSAL_CATEGORIES:
      return { ...state, proposal_categories: action.payload };
    case AppActionType.SET_PROPOSAL_CATEGORIES_V2:
      return { ...state, proposalCategories: action.payload };
    case AppActionType.SET_CATEGORIES_TEMPLATES:
      return { ...state, categoryTemplates: action.payload };
    case AppActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case AppActionType.SET_AUTHORIZER:
      return { ...state, authorizer: action.payload };
    case AppActionType.SET_PROVIDER:
      return { ...state, provider: action.payload };
    case AppActionType.SET_RPC:
      return { ...state, rpc: action.payload };

    case AppActionType.SET_THEME:
      return { ...state, theme: action.payload };

    case AppActionType.SET_LAN:
      return { ...state, language: action.payload };
    case AppActionType.SET_WALLET_TYPE:
      return { ...state, wallet_type: action.payload };
    case AppActionType.SET_SNS_MAP:
      return { ...state, snsMap: action.payload };
    case AppActionType.SET_SNS:
      return { ...state, sns: action.payload };
    case AppActionType.SET_HAD_ONBOARDING:
      return { ...state, hadOnboarding: action.payload };
    case AppActionType.SET_CURRENT_SEASON:
      return { ...state, currentSeason: action.payload };
    case AppActionType.SET_METAFORO_TOKEN:
      return { ...state, metaforoToken: action.payload };
    case AppActionType.SET_THIRD_PARTY_TOKEN:
      localStorage.setItem(SEE_AUTH, JSON.stringify(action.payload));
      localStorage.setItem(METAFORO_TOKEN,JSON.stringify(action.payload?.metaforo));
      return { ...state, deschoolToken: action.payload?.deschool, metaforoToken: action.payload?.metaforo };
    case AppActionType.SET_SHOW_METAFORO_LOGIN_MODAL:
      return { ...state, show_metaforo_login: action.payload };
    case AppActionType.SET_USER_MAP:
      return { ...state, userMap: action.payload };
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
