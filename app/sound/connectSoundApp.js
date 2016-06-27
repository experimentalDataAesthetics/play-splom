import {
  SPAWN_SYNTHS,
  SET_LOOP
} from '../actionTypes';

import {
  spawnEventsFromBrush,
  loopModePayload
} from '../selectors/index';
import {
  setLooping
} from '../actions/interaction';

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

export default function connectSoundApp(store, callActionOnMain) {
  // call handler on change of pointsEntering
  observeStore(store, getPointsEntering, (state) => {
    // pointsEntering changed: m n indices
    // generate synths from that
    // for now: send using callActionOnMain
    // later: set to state.synth.spawnEvents
    // and let redux-electron-store copy it over
    const synthEvents = spawnEventsFromBrush(state);
    if (synthEvents.length) {
      callActionOnMain({
        type: SPAWN_SYNTHS,
        payload: synthEvents
      });
    }
  });

  /**
   * This is a temporary loop system.
   * It just runs a timer and resends the loop events
   * to the SoundApp which pushes it through to a Dryadic component
   * which does the sending.
   *
   * A better system will be to have a have a dryadic client
   * here in the frontend app and have it communicate the changes.
   * A dryad that plays a loop of events and can be live updated.
   */
  let timer;

  function triggerLoop() {
    const state = store.getState();
    const loopMode = state.interaction.loopMode;
    // console.log('triggerLoop gets loopMode:', loopMode);
    let newLoopMode = {
      looping: loopMode.looping
    };

    // stop
    if (!loopMode.looping) {
      newLoopMode.nowPlaying = null;
      newLoopMode.pending = null;
      newLoopMode.looping = false;
    } else {
      // if pending then copy it in
      if (loopMode.pending) {
        newLoopMode.nowPlaying = loopMode.pending;
        newLoopMode.pending = null;
      } else {
        // carry on playing
        newLoopMode = loopMode;
      }
    }

    // console.log('newLoopMode:', newLoopMode);

    if (newLoopMode.nowPlaying) {
      const payload = loopModePayload(newLoopMode.nowPlaying.m, newLoopMode.nowPlaying.n, state);
      // console.log('payload', payload);
      if (payload) {
        callActionOnMain({
          type: SET_LOOP,
          payload
        });
      }
    } else {
      if (timer) {
        // console.log('clear timer', timer);
        clearInterval(timer);
        timer = null;
        // send kill loop
      }
    }

    // update the ui
    if (newLoopMode !== loopMode) {
      // console.log('update state');
      // TODO: does not unset pending
      store.dispatch(setLooping(newLoopMode));
    }
  }

  observeStore(store, getLoopMode, (loopMode) => {
    // console.log('loopMode changed', loopMode);
    if (!timer) {
      // console.log('start interval');
      timer = setInterval(triggerLoop, 10000);
      // console.log('first time trigger');
      triggerLoop();
    }
  });
}
