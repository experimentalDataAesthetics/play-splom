import {
  SET_POINTS_UNDER_BRUSH,
  TOGGLE_LOOP_MODE,
  SET_LOOP_TIME
} from '../actionTypes';
import {
  calcPointsEntering
} from '../selectors/index';
import u from 'updeep';
import { xor, get, now } from 'lodash';

const DEFAULT_LOOP_TIME = 10;

/**
 * Top level reducer that takes handles actions and calls
 * the appropriate reducer.
 *
 * A reducer take state and action and returns a new transformed state.
 *
 * This reducer only gets state.interaction
 */
export default function interaction(state = {}, action) {
  switch (action.type) {
    case SET_POINTS_UNDER_BRUSH:
      return setPointsUnderBrush(state, action);
    case TOGGLE_LOOP_MODE:
      return toggleLoopMode(state, action);
    case SET_LOOP_TIME:
      return setLoopTime(state, action);
    default:
      return state;
  }
}


/**
 * setPointsUnderBrush - Action triggered by mouse move,
 *  sets the current points inside the brush rectangle.
 *
 * @param  {Object} state  current state
 * @param  {Object} action payload is {m n indices}
 * @return {Object}        new state
 */
function setPointsUnderBrush(state, action) {
  const differentBox = (state.m !== action.payload.m) ||
      (state.n !== action.payload.n);

  if (differentBox ||
    xor(state.pointsUnderBrush || [], action.payload.indices || []).length !== 0) {
    const prevPub = state.pointsUnderBrush || [];
    const pub = action.payload.indices || [];
    return u({
      previousPointsUnderBrush: prevPub,
      pointsUnderBrush: pub,
      m: action.payload.m,
      n: action.payload.n,
      pointsEntering: calcPointsEntering(pub, prevPub)
    }, state);
  }

  return state;
}


function _sameBox(state, payload, key) {
  if (get(state, `loopMode.${key}`)) {
    const m = get(state, `loopMode.${key}.m`);
    const n = get(state, `loopMode.${key}.n`);
    return m && n && (m === payload.m) && (n === payload.n);
  }
}


/**
 * toggleLoopMode - toggles the SoundApp's loop mode on or off
 *
 * Updates state.interaction.loopMode
 *
 * If not currently looping then it starts looping that m@n box.
 * If you click on a different box then it changes the loop to that.
 * If you click on the currently playing box then it stops looping.
 *
 * @param  {Object} state   current state
 * @param  {Object} action  .payload is {m n}
 * @return {Object}         new state
 */
function toggleLoopMode(state, action) {
  const loopMode = {
    loopTime: get(state, 'loopMode.loopTime') || DEFAULT_LOOP_TIME
  };

  // clicked the same box, toggle it to off
  if (_sameBox(state, action.payload, 'box')) {
    loopMode.box = null;
    loopMode.epoch = null;
  } else {
    loopMode.box = action.payload;
    // if not already playing then start the loop in 50ms
    if (!get(state, 'loopMode.epoch')) {
      loopMode.epoch = now() + 50;
    }
  }

  return u({ loopMode }, state);
}


function setLoopTime(state, action) {
  const loopMode = {
    loopTime: action.payload.loopTime || DEFAULT_LOOP_TIME
  };

  return u({loopMode}, state);
}
