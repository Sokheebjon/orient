import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {StoreProvider} from "./Store";
import reportWebVitals from './reportWebVitals';
import "./i18/i18Next";
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
   <StoreProvider>
      <BrowserRouter>
         <App/>
      </BrowserRouter>
   </StoreProvider>,
   document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.register();
reportWebVitals();
