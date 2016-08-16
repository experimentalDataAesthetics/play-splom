/**
 * Runs in the renderer process.
 *
 * Connects to the redux store and forwards actions
 * to the background process, where they are forwarded
 * to the SoundApp
 */

import {
  SPAWN_SYNTHS,
  SET_LOOP
} from '../actionTypes';

import {
  spawnEventsFromBrush,
  loopModePayload
} from '../selectors/index';


/**
 * observeStore - Call onChange whenever the state changes
 *
 * On each change in the Redux store, this derives an object
 * using a Reselect selector function and compares that to the previously derived object.
 *
 * @param  {type} store         Redux store
 * @param  {Function} select    Reselect selector function that derives an Object from state
 * @param  {Function} onChange  Handler that you wish to be called
 * @return {Function}           Unsubscribe function
 */
function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    const state = store.getState();
    const nextState = select(state);
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(state);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

const getPointsEntering = (state) => state.interaction.pointsEntering;
const getLoopMode = (state) => state.interaction.loopMode;


/**
 * connectSoundApp - connect redux store to the SoundApp on main thread
 *
 * Observes the redux store:
 *
 *  for pointsEntering it spawns synth events via callActionOnMain SPAWN_SYNTHS
 *
 *  for loopMode it makes the loop payload and sends SET_LOOP to main
 *
 * @param  {Object} store            redux store
 * @param  {Function} callActionOnMain
 * @return {undefined}
 */
export default function connectSoundApp(store, callActionOnMain) {

  // call handler on change of pointsEntering
  observeStore(store, getPointsEntering, (state) => {
    // pointsEntering changed: m n indices
    // generate synths from that
    // for now: send using callActionOnMain
    const synthEvents = spawnEventsFromBrush(state);
    if (synthEvents.length) {
      callActionOnMain({
        type: SPAWN_SYNTHS,
        payload: synthEvents
      });
    }
  });

  // on change of: loopMode, sound, mapping
  observeStore(store, getLoopMode, (state) => {
    callActionOnMain({
      type: SET_LOOP,
      payload: loopModePayload(state)
    });
  });
}
