
const redux = require('redux');
const thunkMiddleware = require('redux-thunk');
const createLogger = require('redux-logger');

import rootReducer from '../reducers/index';

export default function configureStore(initialState) {

  const logger = createLogger({
    collapsed: true,
    predicate: () => process.env.NODE_ENV === `development`
  });

  const middleware = redux.applyMiddleware(thunkMiddleware, logger);

  const store = middleware(redux.createStore)(rootReducer, initialState);
  // 2.0 ?
  // const store = redux.createStore(rootReducer, middleware);

  return store;
}
