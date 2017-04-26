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
 * Each module in reducers/ (reducers/interaction.js, reducers/datasets.js etc)
 * export functions that have the same names as the action.type that they handle.
 *
 * If the actions.type === function name then it is called with (state, action)
 * and should return a new modified state in response to that action.
 *
 * Actually they are each given just it's slice of the state:
 * reducers/interaction.js gets (state.interaction, action)
 * and should return a new state for just that slice.
 *
 * They shouldn't concern themselves with other parts of the state object.
 *
 * So reducers/interaction is given state.interaction and should return a new
 * state object which is saved back into state['interaction']
 */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { autoReducer } from '../utils/reduxers';
import * as dataset from './dataset';
import * as datasets from './datasets';
import * as mapping from './mapping';
import * as sound from './sound';
import * as sounds from './sounds';
import * as ui from './ui';
import * as interaction from './interaction';
import * as transport from './transport';

// Combine all into a single reduction function
// that can be passed to createStore
// http://redux.js.org/docs/api/combineReducers.html
const reducers = combineReducers({
  datasets: autoReducer(datasets),
  dataset: autoReducer(dataset),
  sounds: autoReducer(sounds),
  sound: autoReducer(sound),
  mapping: autoReducer(mapping),
  ui: autoReducer(ui),
  interaction: autoReducer(interaction),
  transport: autoReducer(transport),
  routing
});

export default function(state = {}, action) {
  const nextState = reducers(state, action);
  if (process.env.NODE_ENV !== 'production') {
    if (state === nextState) {
      console.error('ACTION NOT HANDLED:', action);
    }
  }
  return nextState;
}
