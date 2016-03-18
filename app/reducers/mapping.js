import {SET_MAPPING, SET_MAPPING_RANGE} from '../actionTypes';
const u = require('updeep');

export default function(state={}, action) {
  switch (action.type) {

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
