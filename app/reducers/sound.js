import { SELECT_SOUND } from '../actionTypes';

export default function(state = null, action) {
  switch (action.type) {
    case SELECT_SOUND:
      return action.payload;
    default:
      return state;
  }
}
