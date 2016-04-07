const fs = require('fs');
const path = require('path');
const jetpack = require('fs-jetpack');

import {SET_SOUNDS, SELECT_SOUND, SPAWN_SYNTH, SET_MASTER_CONTROLS} from '../actionTypes';
import callActionOnMain from '../ipc/callActionOnMain';

/**
 * Load synthdefs from included sound directory
 */
export function loadSounds(synthDefsDir) {
  return (dispatch) => {
    fs.readdir(synthDefsDir, (err, files) => {
      if (err) {
        throw new Error(err);
      }

      let sounds = [];

      files.forEach((p) => {
        if (path.extname(p) === '.json' && (p !== 'master.json')) {
          let fullpath = path.join(synthDefsDir, p);
          let data = jetpack.read(fullpath, 'json');
          data.path = fullpath;
          sounds.push(data);
        }
      });

      dispatch(setSounds(sounds));
    });
  };
}

/**
 * Set sounds (objects with synthdef descriptions) to store
 */
export function setSounds(sounds) {
  return {
    type: SET_SOUNDS,
    payload: sounds
  };
}

/**
 * Select sound by name from interface
 */
export function selectSound(name) {
  return {
    type: SELECT_SOUND,
    payload: name
  };
}

/**
 * Spawn a Synth (from a brush event)
 */
export function spawnSynth(event) {
  callActionOnMain({
    type: SPAWN_SYNTH,
    payload: event
  });
}

/**
 * Set master level controls.
 *
 * amp:
 */
export function setMasterControls(event) {
  callActionOnMain({
    type: SET_MASTER_CONTROLS,
    payload: event
  });
}
