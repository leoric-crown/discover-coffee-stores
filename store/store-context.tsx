import React, { createContext, useReducer, useRef } from "react";
import { CoffeeStore } from "../types";

export interface StoreState {
  latLong: string;
  coffeeStores: CoffeeStore[];
  haveResults: boolean;
}

export enum ActionTypes {
  SetLatLong,
  SetCoffeeStores,
  SetHaveResults,
}

export interface SetLatLong {
  type: ActionTypes.SetLatLong;
  payload: string;
}

export interface SetCoffeeStores {
  type: ActionTypes.SetCoffeeStores;
  payload: CoffeeStore[];
}

export interface SetHaveResults {
  type: ActionTypes.SetHaveResults;
  payload: boolean;
}

export type StoreActions = SetLatLong | SetCoffeeStores | SetHaveResults;

const initialState: StoreState = {
  latLong: "",
  coffeeStores: [],
  haveResults: false,
};

const storeReducer = (state: StoreState, action: StoreActions) => {
  switch (action.type) {
    case ActionTypes.SetLatLong:
      return { ...state, latLong: action.payload };
    case ActionTypes.SetCoffeeStores:
      return { ...state, coffeeStores: action.payload };
    case ActionTypes.SetHaveResults:
      return { ...state, haveResults: action.payload };
    default:
      throw new Error(`Unhandled action ${action}`);
  }
};

export const StoreContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<StoreActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
