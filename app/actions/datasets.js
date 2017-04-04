import fs from 'fs';
import { extname, basename, join } from 'path';
import Miso from 'miso.dataset';
import jetpack from 'fs-jetpack';

import {
  SELECT_DATASET,
  ADD_DATASET_PATHS,
  OPEN_DATASET_DIALOG
} from '../actionTypes';
import callActionOnMain from '../ipc/callActionOnMain';
import { notify } from './ui';
import { clipLoopBox } from './interaction';

/**
 * setDataset - having loaded and parsed a dataset, put that into the redux state
 *
 * @param {String} path         Path the dataset was loaded from
 * @param {Miso.Dataset} data   The data itself
 * @param {Object} metadata     Database metadata information (from Miso. often blank)
 */
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

/**
 * Call the main process to open a select file dialog
 */
export function openDatasetDialog() {
  return () => {
    callActionOnMain({
      type: OPEN_DATASET_DIALOG
    });
  };
}

const parsers = {
  '.json': Miso.Dataset.Parsers.Obj, // already parsed to data
  '.csv': Miso.Dataset.Parsers.Delimited
};

/**
 * loading should be moved to main
 *
 * path should be a resolved
 */
export function loadDataset(path) {
  return dispatch => {
    const ext = extname(path);
    const parser = parsers[ext];

    function fail(message) {
      dispatch(notify('error', message));
    }

    if (!parser) {
      return fail(`Filetype not supported: ${ext}`);
    }

    dispatch(notify('inform', 'Loading...'));

    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        return fail(err.message);
      }

      if (!data) {
        return fail(`No data loaded from ${path}`);
      }

      let data2;
      if (ext === '.json') {
        try {
          data2 = JSON.parse(data);
        } catch (e) {
          return fail(e);
        }
      } else {
        data2 = String(data);
      }

      const ds = new Miso.Dataset({
        data: data2,
        parser
      });

      // This can fail inside here but it will not
      // reject the Promise. It only posts the error to console.
      ds.fetch().then(
        data3 => {
          dispatch(notify());
          dispatch(setDataset(path, data3));
          dispatch(clipLoopBox());
        },
        error => fail(error)
      );
    });
  };
}

/**
 * Read the list of included datasets and populate the menu.
 * Then optionally load one of them.
 * This is called at startup.
 */
export function readDefaultDatasets(datasetsDir, thenLoadPath) {
  return dispatch => {
    jetpack.listAsync(datasetsDir).then(paths => {
      if (paths) {
        const dp = paths
          // only show those that have a parser
          .filter(p => Boolean(parsers[extname(p)]))
          .map(p => {
            return {
              name: p,
              path: join(datasetsDir, p)
            };
          });
        dispatch(addDatasetPaths(dp));

        if (thenLoadPath) {
          setTimeout(
            () => {
              dispatch(loadDataset(thenLoadPath));
            },
            500
          );
        }
      } else {
        dispatch(notify('error', `No paths found at: ${datasetsDir}`));
      }
    });
  };
}

export function addDatasetPaths(paths) {
  return {
    type: ADD_DATASET_PATHS,
    payload: {
      paths
    }
  };
}
