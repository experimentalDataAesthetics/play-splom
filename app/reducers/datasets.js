import _ from 'lodash';
import { SELECT_DATASET, ADD_DATASET_PATHS } from '../actionTypes';

export default function(state = [], action) {
  switch (action.type) {
    case ADD_DATASET_PATHS: {
      // Add any paths are not already in state.datasets
      // datasets is an Array of {name: path: }
      // state.datasets may contain already loaded datasets with
      // {name: path: data: metadata: }
      return _.unionBy(state, action.payload.paths, 'path');
    }

    case SELECT_DATASET: {
      // reducers/dataset also handles SELECT_DATASET
      // Add to datasets if its not already there
      if (!_.find(state, ds => ds.path === action.payload.path)) {
        return [action.payload].concat(state);
      }
      return state;
    }

    default:
      return state;
  }
}
