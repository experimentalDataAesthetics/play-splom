import _ from 'lodash';

export default function(state = [], action) {
  switch (action.type) {
    case 'addDatasetPaths': {
      // Add any paths are not already in state.datasets
      // datasets is an Array of {name: path: }
      // state.datasets may contain already loaded datasets with
      // {name: path: data: metadata: }
      return _.unionBy(state, action.payload.paths, 'path');
    }

    case 'selectDataset': {
      // reducers/dataset also handles 'selectDataset'
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
