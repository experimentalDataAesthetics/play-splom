import {STOP, START, RECORD} from '../actionTypes';

/**
 * @param {Boolean} playing
 */
export function setPlaying(playing) {
  // calls to the engine to start
  // dispatches to set playing
  return {
    type: SET_PLAYING,
    payload: {
      playing
    }
  };
}

/**
 * @param {Boolean} recording
 */
export function setRecording(recording) {
  // calls to the engine to start/stop recording
  // dispatches to set recording state
  return {
    type: SET_RECORDING,
    payload: {
      recording
    }
  };
}
