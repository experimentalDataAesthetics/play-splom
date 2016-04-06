
const redux = require('redux');
const thunk = require('redux-thunk').default;
const devTools = require('remote-redux-devtools');

import rootReducer from '../reducers/index';

export default function configureStore(initialState={}) {

  let thunked = redux.applyMiddleware(thunk);

  const enhancer = redux.compose(
    thunked,
    devTools()
  );

  let store = redux.createStore(
    rootReducer,
    initialState,
    enhancer
    // thunked
  );

  return store;
}
