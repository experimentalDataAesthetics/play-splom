import * as _ from 'lodash';
import {
  SHOW_BRUSH,
  SET_POINTS_UNDER_BRUSH,
  TOGGLE_LOOP_MODE,
  SET_LOOP_TIME
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


/**
 * setPointsUnderBrush - called when moving the brush over points.
 *
 * points under brush is further processed into The sound app responds to changes in poin
 *
 * @param  {number} m       box coordinate
 * @param  {number} n       box coordinate
 * @param  {Array} indices  list of point indices
 * @return {Object}         action
 */
export function setPointsUnderBrush(m, n, indices) {
  return (dispatch, getState) => {
    const s = getState().interaction;
    const same = (_.isEqual(s.pointsUnderBrush, indices));
    if (!same) {
      dispatch({
        type: SET_POINTS_UNDER_BRUSH,
        payload: {
          indices,
          m,
          n
        }
      });
    }
  };
}


/**
 * toggleLoopMode - turns loop on, or changes it to a different box or turns it off
 *
 * @param  {number} m box coordinate
 * @param  {number} n box coordinate
 * @return {Object}   action
 */
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
 * setLoopTime
 *
 * @param  {number} loopTime
 * @return {Object} action
 */
export function setLoopTime(loopTime) {
  return {
    type: SET_LOOP_TIME,
    payload: {
      loopTime
    }
  };
}
