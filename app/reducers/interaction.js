import u from 'updeep';
import { xor, get, now } from 'lodash';
import {
  SET_POINTS_UNDER_BRUSH,
  TOGGLE_LOOP_MODE,
  SET_LOOP_BOX,
  SET_LOOP_TIME
} from '../actionTypes';
import {
  calcPointsEntering
} from '../selectors/index';

const DEFAULT_LOOP_TIME = 10;

/**
 * Top level reducer that takes handles actions and calls
 * the appropriate reducer.
 *
 * A reducer take state and action and returns a new transformed state.
 *
 * This reducer only gets state.interaction so state and new state here
 * refer just to that part of the whole state object.
 *
 * @param  {Object} state     current state
 * @param  {Object} action    with .type and .payload
 * @return {Object}           new state
 */
export default function interaction(state = {}, action) {
  switch (action.type) {
    case SET_POINTS_UNDER_BRUSH:
      return setPointsUnderBrush(state, action);
    case TOGGLE_LOOP_MODE:
      return toggleLoopMode(state, action);
    case SET_LOOP_BOX:
      return setLoopBox(state, action);
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
 * @param  {Object} state     current state
 * @param  {Object} action    payload is {m n indices}
 * @return {Object}           new state
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


/**
 * _sameBox - is payload.m/n the same box as state.loopMode[key].m/n ?
 *
 * @param  {Object} state       current state
 * @param  {Object} action      payload is {m n indices}
 * @param  {string} key='box'   which key in current state to compare it to
 * @return {Boolean}            the answer
 */
function _sameBox(state, payload, key = 'box') {
  if (get(state, `loopMode.${key}`)) {
    const m = get(state, `loopMode.${key}.m`);
    const n = get(state, `loopMode.${key}.n`);
    return m && n && (m === payload.m) && (n === payload.n);
  }
}


/**
 * setLoopBox - toggles the SoundApp's loop mode on or off
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
function setLoopBox(state, action) {
  const loopMode = {
    loopTime: get(state, 'loopMode.loopTime') || DEFAULT_LOOP_TIME
  };

  // clicked the same box, toggle it to off
  if (_sameBox(state, action.payload, 'box')) {
    loopMode.lastBox = get(state, 'loopMode.box');
    loopMode.box = null;
    loopMode.epoch = null;
  } else {
    loopMode.box = action.payload;
    // if not already playing then start the loop in 50ms
    if (!get(state, 'loopMode.epoch')) {
      loopMode.epoch = now() + 50;
    }
    loopMode.lastBox = get(state, 'loopMode.box');
  }

  return u({ loopMode }, state);
}


/**
 * toggleLoopMode - turn loop on or off
 *
 * If turning it on then it starts with the last looped box.
 *
 * @param  {Object} state   current state
 * @return {Object}         new state
 */
function toggleLoopMode(state) {
   /* , action */
  const loopMode = {};
  const box = get(state, 'loopMode.box');

  if (box) {
    loopMode.lastBox = box;
    loopMode.box = null;
    loopMode.epoch = null;
  } else {
    // or last hovered
    const lastBox = get(state, 'loopMode.lastBox') || {m: 0, n: 0};
    return setLoopBox(state, {payload: lastBox});
  }

  return u({ loopMode }, state);
}


/**
 * setLoopTime - set the loop time in seconds
 *
 * @param  {Object} state   current state
 * @param  {Object} action  .payload is {loopTime: int}
 * @return {Object}         new state
 */
function setLoopTime(state, action) {
  const loopMode = {
    loopTime: action.payload.loopTime || DEFAULT_LOOP_TIME
  };

  return u({ loopMode }, state);
}
