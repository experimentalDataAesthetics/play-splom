/**
 * Runs in the renderer process.
 *
 * Connects to the redux store and forwards actions
 * to the background process, where they are forwarded
 * to the SoundApp
 */

import { spawnEventsFromBrush, getLoopModePayload } from '../selectors/index';

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
  let currentDerivedState;

  function handleChange() {
    const state = store.getState();
    const derivedState = select(state);
    if (derivedState !== currentDerivedState) {
      currentDerivedState = derivedState;
      onChange(state, derivedState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

const getPointsEntering = state => state.interaction.pointsEntering;

/**
 * connectSoundApp - connect redux store to the SoundApp on main thread
 *
 * Observes the redux store:
 *
 *  for pointsEntering it spawns synth events via callActionOnMain 'spawnSynths'
 *
 *  for loopMode it makes the loop payload and sends 'setLoop' to main
 *
 * @param  {Object} store            redux store
 * @param  {Function} callActionOnMain
 * @return {undefined}
 */
export default function connectSoundApp(store, callActionOnMain) {
  observeStore(store, getPointsEntering, state => {
    const synthEvents = spawnEventsFromBrush(state);
    if (synthEvents.length) {
      callActionOnMain({
        type: 'spawnSynths',
        payload: synthEvents
      });
    }
  });

  observeStore(store, getLoopModePayload, (state, payload) => {
    callActionOnMain({
      type: 'setLoop',
      payload: {
        ...payload,
        epoch: performance.timing.navigationStart + payload.epoch
      }
    });
  });
}
