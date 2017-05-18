import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { combinedReducer } from './Reducers'
import RPD from "./Components/RPD"

export const store = createStore(combinedReducer);    // why many files for store

ReactDOM.render(
  <div>
    <Provider store={store}>
      <RPD />
    </Provider>
  </div>,
  document.getElementById('root')
);


  //  <Router history={hashHistory}>
  //       <Route path="/:id" component={RPD} />
  //     </Router>


  //?Wtf query string'