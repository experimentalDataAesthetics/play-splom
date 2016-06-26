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

function toggleLoopMode(state, action) {
  // console.log('toggleLoopMode', state, action);
  // click on the same box again: toggle to off
  if (_sameBox(state, action.payload, 'nowPlaying')
    || _sameBox(state, action.payload, 'pending')) {
    // toggle it to off
    return u({
      loopMode: {
        looping: false
      }
    }, state);
    // TODO: but a second tap on pending should not change anything
  }

  return u({
    loopMode: {
      pending: action.payload,
      looping: true
    }
  }, state);
}

/**
 * for UI updates to show that the loop is pending or now playing m@n
 */
function setLooping(state, action) {
  // action may contain nowPlaying and pending
  // updates loopMode, adding these
  // const updates = {
  //   looping: action.payload.looping,
  //   nowPlaying: action.payload.nowPlaying || null,
  //   pending: action.payload.pending || null
  // };
  const loopMode = assign({}, state.loopMode || {}, action.payload);
  const newState = assign({}, state, {loopMode});
  return newState;
}
