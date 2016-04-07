
const redux = require('redux');
const thunk = require('redux-thunk').default;

import rootReducer from '../reducers/index';

export default function configureStore(initialState = {}) {
  const thunked = redux.applyMiddleware(thunk);

  // const enhancer = redux.compose(
  //   thunked,
  // );

  return redux.createStore(
    rootReducer,
    initialState,
    // enhancer
    thunked
  );
}
