import _ from 'lodash';

import callActionOnMain from '../ipc/callActionOnMain';

/**
 * Set sounds (objects with synthdef descriptions) to store
 */
export function setSounds(sounds) {
  return {
    type: 'setSounds',
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
      type: 'selectSound',
      payload: name
    });
    dispatch({
      type: 'autoMap',
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
    type: 'spawnSynth',
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
    type: 'setMasterControls',
    payload: event
  });
}
