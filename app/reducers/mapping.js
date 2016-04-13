import {SET_MAPPING, SET_MAPPING_RANGE, MAP_XY_TO_PARAM} from '../actionTypes';
import u from 'updeep';
import * as _ from 'lodash';

export default function(state={}, action) {
  switch (action.type) {

    case MAP_XY_TO_PARAM:
      // if not already mapped to this
      if (_.get(state, `xy.${action.payload.xy}.param`) === action.payload.param) {
        return state;
      }

      return u({
        mode: 'xy',
        xy: {
          [action.payload.xy]: {
            param: action.payload.param
            // mapper: get default for this param
          }
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
