import {SELECT_DATASET, SET_DATASETS, OPEN_DATASET_DIALOG} from '../actionTypes';
import callActionOnMain from '../ipc/callActionOnMain';

let Miso = require('miso.dataset');
let jetpack = require('fs-jetpack');
let extname = require('path').extname;
let basename = require('path').basename;

export function setDataset(path, data, metadata) {
  let name = basename(path, extname(path));
  return {
    type: SELECT_DATASET,
    payload: {
      name: name,
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

let parsers = {
  '.json': Miso.Dataset.Parsers.Obj,  // already parsed to data
  '.csv': Miso.Dataset.Parsers.Delimited
};

export function loadDataset(path) {
  return (dispatch) => {
    let ext = extname(path);
    let parser = parsers[ext];

    if (!parser) {
      // dispatch error action
      console.error('Filetype not supported:', ext);
      return;
    }

    let readAs = ext === '.json' ? 'json' : 'utf8';
    jetpack.readAsync(path, readAs).then((data) => {

      let ds = new Miso.Dataset({
        data: data,
        parser: parser
      });

      ds.fetch().then((data) => {
        dispatch(setDataset(path, data));
      }, console.error);
    }, console.error);
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
