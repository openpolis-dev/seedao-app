import React, { useReducer, createContext, useContext, useEffect, useCallback } from 'react';

interface IState {
  account?: string;
  show_login_modal?: boolean;
}

export enum AppActionType {
  SET_ACCOUNT = 'set_account',
  SET_LOGIN_MODAL = 'set_login_modal',
}

interface IAction {
  type: AppActionType;
  payload: any;
}

const INIT_STATE: IState = { show_login_modal: false };

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
