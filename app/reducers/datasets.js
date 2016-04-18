import {SET_DATASETS, SELECT_DATASET} from '../actionTypes';

export default function(state = [], action) {
  switch (action.type) {
    case SET_DATASETS:
      return action.payload;
    case SELECT_DATASET:
      // add to datasets if its not there
      let found = false;
      state.forEach((ds) => {
        if (ds.path === action.payload.path) {
          found = true;
        }
      });
      if (!found) {
        return [].concat([action.payload], state);
      }

      return state;
    default:
      return state;
  }
}
