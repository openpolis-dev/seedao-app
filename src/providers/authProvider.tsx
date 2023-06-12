import React, { useReducer, createContext, useContext, useEffect, useCallback } from 'react';

interface IState {
  account?: string;
}
export enum IActionType {}

interface IAction {
  type: IActionType;
  payload: any;
}

const INIT_STATE: IState = {};

const AuthContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
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
