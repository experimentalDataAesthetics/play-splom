/**
 * http://redux.js.org/docs/basics/Reducers.html
 *
 * A reducer take state and action and returns a new transformed state.

 * Actions describe the fact that something happened, but don’t specify
 * how the application’s state changes in response.
 *
 * This is the job of a reducer. The reducers handle the actions and return
 * a new state.
 *
 * Each module in reducers/ (interaction, datasets etc) contains one function
 * that is given just it's slice of the state and should return a new state
 * for that slice.
 *
 * So reducers/interaction is given state.interaction and should return a new
 * state object which is saved back into state['interaction']
 */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import dataset from './dataset';
import datasets from './datasets';
import mapping from './mapping';
import sound from './sound';
import sounds from './sounds';
import ui from './ui';
import interaction from './interaction';
import transport from './transport';

// combine all into a single reduction function
// that can be passed to createStore
// http://redux.js.org/docs/api/combineReducers.html
export default combineReducers({
  datasets,
  dataset,
  sounds,
  sound,
  mapping,
  ui,
  interaction,
  transport,
  routing
});
