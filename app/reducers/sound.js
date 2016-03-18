import {SET_SOUND} from '../actionTypes';

export default function(state=null, action) {
  switch (action.type) {
    case SET_SOUND:
      return action.payload;
    default:
      return state;
  }
}
