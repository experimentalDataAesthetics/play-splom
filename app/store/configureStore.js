
const redux = require('redux');
const thunk = require('redux-thunk').default;
const devTools = require('remote-redux-devtools');

import rootReducer from '../reducers/index';

export default function configureStore(initialState={}) {

  const enhancer = redux.compose(
    redux.applyMiddleware(thunk),
    devTools()
  );

  let store = redux.createStore(
    rootReducer,
    initialState,
    enhancer
  );

  return store;
}
