import {SELECT_DATASET} from '../actionTypes';

export default function(state = null, action) {
  switch (action.type) {
    case SELECT_DATASET:
      return action.payload;
    default:
      return state;
  }
}
