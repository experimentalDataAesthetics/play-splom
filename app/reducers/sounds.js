import { SET_SOUNDS } from '../actionTypes';

export default function sounds(state = [], action) {
  switch (action.type) {
    case SET_SOUNDS:
      return action.payload;
    default:
      return state;
  }
}
