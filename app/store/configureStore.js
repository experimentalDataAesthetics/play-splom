
const redux = require('redux');
const thunk = require('redux-thunk').default;
const createLogger = require('redux-logger');

import rootReducer from '../reducers/index';

export default function configureStore() {

  let logger = createLogger({
    collapsed: true
  });

  let store = redux.createStore(
    rootReducer,
    // Logger must be last middleware in chain,
    // otherwise it will log thunk and promise, not actual actions
    redux.applyMiddleware(thunk, logger)
  );

  return store;
}
