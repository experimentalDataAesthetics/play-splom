import * as _ from 'lodash';
import {
  SHOW_BRUSH,
  SET_POINTS_UNDER_BRUSH,
  TOGGLE_LOOP_MODE,
  SET_LOOPING
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

/**
 * @param {Object} loopingState
 *
 * May contain these:
 *
 *     nowPlaying: {m n}
 *     pending: {m n}
 */
export function setLooping(loopingState) {
  return (dispatch, getState) => {
    const state = getState().interaction.loopMode;
    const comp = {nowPlaying: state.nowPlaying, pending: state.pending};
    if (!_.isEqual(comp, loopingState)) {
      dispatch({
        type: SET_LOOPING,
        payload: loopingState
      });
    }
  };
}
