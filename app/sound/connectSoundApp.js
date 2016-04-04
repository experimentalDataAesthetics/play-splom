import {spawnEventsFromPointsEntering} from '../selectors/index';

/**
 * Runs in the renderer process.
 *
 * Connects to the redux store and forwards actions
 * to the background process, where they are forwarded
 * to the SoundApp
 */

function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let state = store.getState();
    let nextState = select(state);
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(state);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

const getPointsEntering = (state) => {
  return state.interaction.pointsEntering;
};

export default function connectSoundApp(store, callActionOnMain) {
  observeStore(store, getPointsEntering, (state) => {
    // pointsEntering changed: m n indices
    // generate synths from that
    // for now: send using callActionOnMain
    // later: set to state.synth.spawnEvents
    // and let redux-electron-store copy it over
    let synthEvents = spawnEventsFromPointsEntering(state);
    if (synthEvents.length) {
      callActionOnMain({
        type: 'SPAWN_SYNTHS',
        payload: synthEvents
      });
    }
  });
}