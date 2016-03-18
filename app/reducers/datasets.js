import {SET_DATASETS} from '../actionTypes';

export default function(state=[], action) {
  switch (action.type) {
    case SET_DATASETS:
      return action.payload;
    default:
      return state;
  }
}
