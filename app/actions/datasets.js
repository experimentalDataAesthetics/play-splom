import { extname, basename, join } from 'path';
import jetpack from 'fs-jetpack';
import _ from 'lodash';
import { project } from 'data-projector';

import callActionOnMain from '../ipc/callActionOnMain';
import { notify } from './ui';
import { clipLoopBox } from './interaction';

/**
 * setDataset - having loaded and parsed a dataset, put that into the redux state
 *
 * @param {Object} dataset      data-projector dataset
 */
export function setDataset(dataset) {
  return {
    type: 'setDataset',
    payload: _.assign({}, dataset, {
      name: basename(dataset.path, extname(dataset.path))
    })
  };
}

/**
 * Call the main process to open a select file dialog
 */
export function openDatasetDialog() {
  return () => callActionOnMain({ type: 'openDatasetDialog' });
}

const parsers = {
  // '.json': true,
  '.csv': true
};

/**
 * loading should be moved to main
 *
 * path should be a resolved
 */
export function loadDataset(path) {
  return dispatch => {
    dispatch(notify('inform', 'Loading...'));
    project({}, path, {}, []).then(
      dataset => {
        dispatch(notify());
        dispatch(setDataset(dataset));
        dispatch(clipLoopBox());
      },
      error => {
        console.error(error);
        dispatch(notify('error', error.message));
      }
    );
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
          setTimeout(() => {
            dispatch(loadDataset(thenLoadPath));
          }, 500);
        }
      } else {
        dispatch(notify('error', `No paths found at: ${datasetsDir}`));
      }
    });
  };
}

export function addDatasetPaths(paths) {
  return {
    type: 'addDatasetPaths',
    payload: { paths }
  };
}
