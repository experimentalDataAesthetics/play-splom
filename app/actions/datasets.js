import {SELECT_DATASET, SET_DATASETS, OPEN_DATASET_DIALOG} from '../actionTypes';
import callActionOnMain from '../ipc/callActionOnMain';
import { reportError } from './ui';

const Miso = require('miso.dataset');
const jetpack = require('fs-jetpack');
const fs = require('fs');
import { extname, basename, join } from 'path';

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
 * Example datasets are in the ASAR file system
 */
export function loadInternalDataset(path) {
  return loadDataset(path);
}

/**
 * loading should be moved to main
 *
 * path should be a resolved
 */
export function loadDataset(path) {
  return (dispatch) => {
    const ext = extname(path);
    const parser = parsers[ext];

    if (!parser) {
      reportError(`Filetype not supported: ${ext}`);
    }

    fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
      if (err) {
        return reportError(err);
      }

      if (!data) {
        return reportError(`No data loaded from ${path}`);
      }

      let data2;
      if (ext === '.json') {
        try {
          data2 = JSON.parse(data);
        } catch (e) {
          return reportError(e);
        }
      } else {
        data2 = String(data);
      }

      const ds = new Miso.Dataset({
        data: data2,
        parser
      });

      ds.fetch().then((data3) => {
        dispatch(setDataset(path, data3));
      }, reportError);
    });
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
        reportError(`No paths found at: ${datasetsDir}`);
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
