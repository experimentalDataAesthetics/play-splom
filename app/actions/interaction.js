import {BRUSH_DOWN} from '../actionTypes';

/**
 * Probably the animation can be kept local in d3
 * Just call higher level actions.
 */

/**
 * brush interaction in a scatterplot at a point (0..1)
 *
 * @param {Point} point
 */
export function brushDown(point) {
  // show brush state
  // trigger sounds
  return {
    type: BRUSH_DOWN,
    payload: {
      point
    }
  };
}
// move, up

// select loop
// export function shiftDrag() {
//
// }
