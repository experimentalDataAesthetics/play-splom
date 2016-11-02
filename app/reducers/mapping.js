import u from 'updeep';
import * as _ from 'lodash';

import {
  MAP_XY_TO_PARAM,
  SET_FIXED_PARAM,
  SET_MAPPING,
  SET_MAPPING_RANGE,
} from '../actionTypes';

export default function(state = {}, action) {
  switch (action.type) {

    case MAP_XY_TO_PARAM:
      // toggle: if already mapped to this then disconnect it
      if (_.get(state, `xy.${action.payload.xy}.params.${action.payload.param}`)) {
        return u({
          mode: 'xy',
          xy: {
            [action.payload.xy]: {
              // updeep: filter this param out of params
              params: u.omit(action.payload.param)
            }
          }
        }, state);
      }

      // connect it
      return u({
        mode: 'xy',
        xy: {
          [action.payload.xy]: {
            params: {
              [action.payload.param]: true
            }
          },
          // disconnect the obverse if it is connected
          // you cannot map both x and y to the same param
          [action.payload.xy === 'x' ? 'y' : 'x']: {
            params: u.omit(action.payload.param)
          }
        }
      }, state);

    case SET_FIXED_PARAM:
      // sets unipolar values to unipolarMappingRanges
      // selector calculates natural mapped values for display
      // and sending synths
      return u({
        unipolarMappingRanges: {
          [action.payload.param]: action.payload.values
        }
      }, state);

    case SET_MAPPING:
      return u({
        [action.payload.feature]: {
          param: action.payload.param
        }
      }, state);

    case SET_MAPPING_RANGE:
      return u({
        [action.payload.feature]: {
          range: action.payload.range
        }
      }, state);

    default:
      return state;
  }
}
