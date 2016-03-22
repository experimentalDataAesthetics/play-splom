import {SELECT_DATASET, SET_DATASETS, OPEN_DATASET_DIALOG} from '../actionTypes';
import callActionOnMain from '../ipc/callActionOnMain';

export function setDataset(path, data, metadata) {
  return {
    type: SELECT_DATASET,
    payload: {
      path,
      data,
      metadata
    }
  };
}

export function openDatasetDialog() {
  return (dispatch) => {
    callActionOnMain({
      type: OPEN_DATASET_DIALOG
    });
  };
}

export function loadDataset(path) {
  return (dispatch) => {
    // load file or use external tool to analyze it
    // read metadata
    // dispatch(setDataset(path, data, metadata));
  };
}

export function readDefaultDatasets(path) {
  return (dispatch) => {
    // read directory
    // dispatch(setDatasets(paths));
  };
}

export function setDatasets(paths) {
  return {
    type: SET_DATASETS,
    payload: {
      paths
    }
  };
}
