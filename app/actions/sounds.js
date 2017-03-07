
import {
  SET_SOUNDS,
  SELECT_SOUND,
  SPAWN_SYNTH,
  SET_MASTER_CONTROLS,
  AUTO_MAP
} from '../actionTypes';

import callActionOnMain from '../ipc/callActionOnMain';
import _ from 'lodash';

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
  return function _selectSound(dispatch, getState) {
    const state = getState();
    const sound = _.find(state.sounds, { name });
    dispatch({
      type: SELECT_SOUND,
      payload: name
    });
    dispatch({
      type: AUTO_MAP,
      payload: {
        sound
      }
    });
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
