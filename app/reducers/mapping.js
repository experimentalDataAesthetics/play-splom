import {
  MAP_XY_TO_PARAM,
  SET_FIXED_PARAM,
  SET_MAPPING,
  SET_MAPPING_RANGE,
} from '../actionTypes';
import u from 'updeep';
import * as _ from 'lodash';

export default function(state = {}, action) {
  switch (action.type) {

    case MAP_XY_TO_PARAM:
      // if already mapped to this then disconnect it
      if (_.get(state, `xy.${action.payload.xy}.param`) === action.payload.param) {
        return u({
          mode: 'xy',
          xy: {
            [action.payload.xy]: {
              param: null
            }
          }
        }, state);
      }

      // connect it
      return u({
        mode: 'xy',
        xy: {
          [action.payload.xy]: {
            param: action.payload.param
            // mapper: get default for this param
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
