import React, {createContext, useReducer} from 'react';
import reducer from './store/reducer';

export const Store = createContext();

const InitialState = {
   mode: "dark",
   token: localStorage.getItem('id_token'),
   updated: [],
   snackbar: [],
   page: 0,
   perPage: 20
};

export function StoreProvider(props) {
   const [state, dispatch] = useReducer(reducer, InitialState);
   const value = {state: state, dispatch: dispatch};

   return (
      <Store.Provider value={value}>{props.children}</Store.Provider>
   )
}