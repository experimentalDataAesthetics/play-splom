import _ from 'lodash';

export default [];

export function addDatasetPaths(state, action) {
  // Add any paths are not already in state.datasets
  // datasets is an Array of {name: path: }
  // state.datasets may contain already loaded datasets with
  // {name: path: data: metadata: }
  return _.unionBy(state, action.payload.paths, 'path');
}

export function setDataset(state, action) {
  // reducers/dataset also handles 'setDataset'
  // Add to datasets if its not already there
  const dataset = action.payload;
  if (!_.find(state, ds => ds.path === dataset.path)) {
    return [dataset].concat(state);
  }
  return state;
}
