import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from "./index";


export default ({ element }) => (
  <Provider store={createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )}>{element}</Provider>
);
