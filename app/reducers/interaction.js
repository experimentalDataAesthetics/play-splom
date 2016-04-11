import {
  SET_POINTS_UNDER_BRUSH,
  TOGGLE_LOOP_MODE
} from '../actionTypes';
import {
  calcPointsEntering
} from '../selectors/index';
import u from 'updeep';
import { xor, get } from 'lodash';

/**
 * this reducer only gets state.interaction
 */
export default function interaction(state = {}, action) {
  switch (action.type) {
    case SET_POINTS_UNDER_BRUSH:
      return setPointsUnderBrush(state, action);
    case TOGGLE_LOOP_MODE:
      return toggleLoopMode(state, action);
    default:
      return state;
  }
}

function setPointsUnderBrush(state, action) {
  // TODO: or if m/n changed
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

function toggleLoopMode(state, action) {

  const differentBox = (get(state, 'loopMode.m') !== action.payload.m) ||
    (get(state, 'loopMode.n') !== action.payload.n);

  return u({
    loopMode: {
      looping: differentBox ? true : !get(state, 'loopMode.looping', false),
      m: action.payload.m,
      n: action.payload.n
    }
  }, state);
}
