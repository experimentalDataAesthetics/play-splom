import {SET_POINTS_UNDER_BRUSH} from '../actionTypes';
const u = require('updeep');
const _ = require('lodash');
import {calcPointsEntering} from '../selectors/index';

/**
 * this reducer only gets state.interaction
 */
export default function(state={}, action) {

  if (action.type === SET_POINTS_UNDER_BRUSH) {
    // TODO: or if m/n changed
    if (_.xor(state.pointsUnderBrush || [], action.payload.indices || []).length != 0) {

      // and what plot you are on
      // set entering
      let prevPub = state.pointsUnderBrush || [];
      let pub = action.payload.indices || [];
      return u({
        previousPointsUnderBrush: prevPub,
        pointsUnderBrush: pub,
        m: action.payload.m,
        n: action.payload.n,
        pointsEntering: calcPointsEntering(pub, prevPub)
      }, state);

    } else {
      return state;
    }
  }

  return state;
}
