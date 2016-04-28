import {SELECT_DATASET, SET_DATASETS, OPEN_DATASET_DIALOG} from '../actionTypes';
import callActionOnMain from '../ipc/callActionOnMain';

const Miso = require('miso.dataset');
const jetpack = require('fs-jetpack');
import { extname, basename, join } from 'path';

function absolutePath(path) {
  const app = require('remote').require('app');
  return join(app.getAppPath(), path);
}

export function setDataset(path, data, metadata) {
  const name = basename(path, extname(path));
  return {
    type: SELECT_DATASET,
    payload: {
      name,
      path,
      data,
      metadata
    }
  };
}

export function openDatasetDialog() {
  return () => {
    callActionOnMain({
      type: OPEN_DATASET_DIALOG
    });
  };
}

const parsers = {
  '.json': Miso.Dataset.Parsers.Obj,  // already parsed to data
  '.csv': Miso.Dataset.Parsers.Delimited
};

/**
 * loading should be moved to main
 */
export function loadDataset(path) {
  return (dispatch) => {
    const ext = extname(path);
    const parser = parsers[ext];

    if (!parser) {
      // dispatch error action
      console.error('Filetype not supported:', ext);
      return;
    }

    const readAs = ext === '.json' ? 'json' : 'utf8';
    jetpack.readAsync(absolutePath(path), readAs).then((data) => {

      if (data) {
        const ds = new Miso.Dataset({
          data,
          parser
        });

        return ds.fetch().then((data2) => {
          dispatch(setDataset(path, data2));
        });
      }

      throw new Error(`No data loaded from ${path}`);
    }).catch((err) => console.error(err));
  };
}

/**
 * You wouldn't want to load them all into memory and keep them there.
 * Should only store paths and load/dump on demand
 */
export function readDefaultDatasets(datasetsDir, thenLoadPath) {
  return (dispatch) => {
    jetpack.listAsync(datasetsDir).then((paths) => {
      if (paths) {
        dispatch(setDatasets(paths.map((p) => join(datasetsDir, p))));
        if (thenLoadPath) {
          setTimeout(() => {
            dispatch(loadDataset(join(datasetsDir, thenLoadPath)));
          }, 500);
        }
      } else {
        throw new Error(`No paths found at: ${datasetsDir}`);
      }
    });
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
