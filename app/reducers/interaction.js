import {
  SET_POINTS_UNDER_BRUSH,
  TOGGLE_LOOP_MODE,
  SET_LOOPING
} from '../actionTypes';
import {
  calcPointsEntering
} from '../selectors/index';
import u from 'updeep';
import { xor, get, assign } from 'lodash';

/**
 * this reducer only gets state.interaction
 */
export default function interaction(state = {}, action) {
  switch (action.type) {
    case SET_POINTS_UNDER_BRUSH:
      return setPointsUnderBrush(state, action);
    case TOGGLE_LOOP_MODE:
      return toggleLoopMode(state, action);
    case SET_LOOPING:
      return setLooping(state, action);
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
  // actionCreator can do this with a thunk
  // and avoid calling any action
  const differentBox = (get(state, 'loopMode.m') !== action.payload.m) ||
    (get(state, 'loopMode.n') !== action.payload.n);

  const looping = differentBox ? true : !get(state, 'loopMode.looping', false);

  return u({
    loopMode: {
      looping,
      // these can be removed in favor of pending/nowPlaying
      m: action.payload.m,
      n: action.payload.n,
      pending: {
        m: looping && action.payload.m,
        n: looping && action.payload.n
      }
    }
  }, state);
}

/**
 * for UI updates to show that the loop is pending or now playing m@n
 */
function setLooping(state, action) {
  // action may contain nowPlaying and pending
  // updates loopMode, adding these
  const updates = {
    nowPlaying: action.payload.nowPlaying || {},
    pending: action.payload.pending || {}
  };
  const loopMode = assign({}, state.loopMode, updates);
  const newState = assign({}, state, {loopMode});
  return newState;
}
