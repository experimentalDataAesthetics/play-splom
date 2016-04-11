import {
  SHOW_BRUSH,
  SET_POINTS_UNDER_BRUSH,
  TOGGLE_LOOP_MODE
} from '../actionTypes';

export function showBrush(show, x, y) {
  return {
    type: SHOW_BRUSH,
    payload: {
      show,
      x,
      y
    }
  };
}

export function setPointsUnderBrush(m, n, indices) {
  return {
    type: SET_POINTS_UNDER_BRUSH,
    payload: {
      m,
      n,
      indices
    }
  };
}

export function toggleLoopMode(m, n) {
  return {
    type: TOGGLE_LOOP_MODE,
    payload: {
      m,
      n
    }
  };
}
